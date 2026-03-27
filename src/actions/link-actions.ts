"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { createLinkSchema, updateLinkSchema } from "@/lib/schemas";
import { generateUniqueShortCode } from "@/lib/short-code";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { USER_LINK_LIMIT } from "@/lib/config";
import { eq, count, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { verifyLinkOwnership } from "@/lib/security";

export async function createLink(input: {
  targetUrl: string;
  mode: "redirect" | "linkhub";
  title?: string;
  redirectDelay?: number;
  landingData?: Record<string, unknown>;
}) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success } = await checkRateLimit(
    `create:${session.user.id}`,
    LIMITS.CREATE_AUTH.limit,
    LIMITS.CREATE_AUTH.windowMs
  );
  if (!success) return { error: "Rate limit exceeded. Try again in a minute." };

  const [{ total }] = await db
    .select({ total: count() })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id));

  if (total >= USER_LINK_LIMIT) {
    return { error: `Link limit reached (${USER_LINK_LIMIT})` };
  }

  const shortCode = await generateUniqueShortCode();

  const [link] = await db
    .insert(shortLinks)
    .values({
      shortCode,
      ownerId: session.user.id,
      mode: parsed.data.mode,
      targetUrl: parsed.data.targetUrl,
      title: parsed.data.title ?? null,
      redirectDelay: parsed.data.redirectDelay ?? null,
      landingData: parsed.data.landingData ?? null,
    })
    .returning();

  return {
    shortCode: link.shortCode,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
    id: link.id,
  };
}

export async function updateLink(
  linkId: string,
  data: {
    targetUrl?: string;
    mode?: "redirect" | "linkhub";
    title?: string;
    redirectDelay?: number | null;
    landingData?: Record<string, unknown>;
  }
) {
  await verifyLinkOwnership(linkId);

  const parsed = updateLinkSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input" };

  await db
    .update(shortLinks)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
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
      title: shortLinks.title,
      status: shortLinks.status,
      clickCount: shortLinks.clickCount,
      redirectDelay: shortLinks.redirectDelay,
      landingData: shortLinks.landingData,
      createdAt: shortLinks.createdAt,
    })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id))
    .orderBy(sql`${shortLinks.createdAt} DESC`);

  return { links };
}

export async function getLinkById(linkId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await verifyLinkOwnership(linkId);

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.id, linkId))
    .limit(1);

  if (!link) return { error: "Not found" };

  return { link };
}
