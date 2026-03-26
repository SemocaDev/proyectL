"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { shortLinks, linkClicks } from "@/db/schema";
import { createLinkSchema } from "@/lib/schemas";
import { generateUniqueShortCode } from "@/lib/short-code";
import {
  checkRateLimit,
  anonCreateLimiter,
  authCreateLimiter,
} from "@/lib/rate-limit";
import {
  ANON_LINK_LIMIT,
  ANON_LINK_TTL_HOURS,
  USER_LINK_LIMIT,
} from "@/lib/config";
import { eq, count, sql, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { verifyLinkOwnership } from "@/lib/security";

export async function createLink(input: {
  targetUrl: string;
  mode: "redirect" | "linkhub";
}) {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const session = await auth();
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (session?.user) {
    const { success } = await checkRateLimit(
      authCreateLimiter,
      session.user.id
    );
    if (!success) return { error: "Rate limit exceeded" };

    const [{ total }] = await db
      .select({ total: count() })
      .from(shortLinks)
      .where(eq(shortLinks.ownerId, session.user.id));

    if (total >= USER_LINK_LIMIT) {
      return { error: `Link limit reached (${USER_LINK_LIMIT})` };
    }
  } else {
    const { success } = await checkRateLimit(anonCreateLimiter, ip);
    if (!success) return { error: "Rate limit exceeded" };

    const [{ total }] = await db
      .select({ total: count() })
      .from(shortLinks)
      .where(
        sql`${shortLinks.ownerId} IS NULL AND ${shortLinks.createdAt} > NOW() - INTERVAL '24 hours'`
      );

    if (total >= ANON_LINK_LIMIT) {
      return { error: `Anonymous link limit reached (${ANON_LINK_LIMIT})` };
    }
  }

  const shortCode = await generateUniqueShortCode();

  const expiresAt = session?.user
    ? null
    : new Date(Date.now() + ANON_LINK_TTL_HOURS * 60 * 60 * 1000);

  const [link] = await db
    .insert(shortLinks)
    .values({
      shortCode,
      ownerId: session?.user?.id ?? null,
      mode: parsed.data.mode,
      targetUrl: parsed.data.targetUrl,
      isClaimed: !!session?.user,
      expiresAt,
    })
    .returning();

  return {
    shortCode: link.shortCode,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
  };
}

export async function deleteLink(linkId: string) {
  await verifyLinkOwnership(linkId);

  await db.delete(shortLinks).where(eq(shortLinks.id, linkId));

  return { success: true };
}

export async function getUserLinks() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const links = await db
    .select({
      id: shortLinks.id,
      shortCode: shortLinks.shortCode,
      mode: shortLinks.mode,
      targetUrl: shortLinks.targetUrl,
      status: shortLinks.status,
      isClaimed: shortLinks.isClaimed,
      createdAt: shortLinks.createdAt,
      clickCount: sql<number>`(
        SELECT COUNT(*) FROM ${linkClicks}
        WHERE ${linkClicks.linkId} = ${shortLinks.id}
      )`,
    })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id))
    .orderBy(sql`${shortLinks.createdAt} DESC`);

  return { links };
}

export async function updateLink(
  linkId: string,
  data: { targetUrl?: string; mode?: "redirect" | "linkhub" }
) {
  await verifyLinkOwnership(linkId);

  await db
    .update(shortLinks)
    .set(data)
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}
