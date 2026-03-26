"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import { USER_LINK_LIMIT } from "@/lib/config";

export async function claimLink(linkId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Must be signed in to claim a link" };
  }

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(and(eq(shortLinks.id, linkId), isNull(shortLinks.ownerId)))
    .limit(1);

  if (!link) {
    return { error: "Link not found or already claimed" };
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id));

  if (total >= USER_LINK_LIMIT) {
    return { error: `Link limit reached (${USER_LINK_LIMIT})` };
  }

  await db
    .update(shortLinks)
    .set({
      ownerId: session.user.id,
      isClaimed: true,
      expiresAt: null,
    })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}
