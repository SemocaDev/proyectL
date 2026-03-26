"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { shortLinks, linkClicks } from "@/db/schema";
import { createLinkSchema } from "@/lib/schemas";
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
  customAlias?: string;
}) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit por usuario
  const { success } = await checkRateLimit(
    `create:${session.user.id}`,
    LIMITS.CREATE_AUTH.limit,
    LIMITS.CREATE_AUTH.windowMs
  );
  if (!success) return { error: "Rate limit exceeded. Try again in a minute." };

  // Límite de links por usuario
  const [{ total }] = await db
    .select({ total: count() })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id));

  if (total >= USER_LINK_LIMIT) {
    return { error: `Link limit reached (${USER_LINK_LIMIT})` };
  }

  // Verificar alias personalizado si se provee
  if (parsed.data.customAlias) {
    const [existing] = await db
      .select({ id: shortLinks.id })
      .from(shortLinks)
      .where(eq(shortLinks.shortCode, parsed.data.customAlias))
      .limit(1);

    if (existing) {
      return { error: "That alias is already taken" };
    }
  }

  const shortCode = parsed.data.customAlias ?? (await generateUniqueShortCode());

  const [link] = await db
    .insert(shortLinks)
    .values({
      shortCode,
      ownerId: session.user.id,
      mode: parsed.data.mode,
      targetUrl: parsed.data.targetUrl,
      title: parsed.data.title ?? null,
    })
    .returning();

  return {
    shortCode: link.shortCode,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
    id: link.id,
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
      title: shortLinks.title,
      status: shortLinks.status,
      clickCount: shortLinks.clickCount,
      createdAt: shortLinks.createdAt,
    })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id))
    .orderBy(sql`${shortLinks.createdAt} DESC`);

  return { links };
}

export async function updateLink(
  linkId: string,
  data: {
    targetUrl?: string;
    mode?: "redirect" | "linkhub";
    title?: string;
    landingData?: Record<string, unknown>;
  }
) {
  await verifyLinkOwnership(linkId);

  await db
    .update(shortLinks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}
