"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function acceptTerms(): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "unauthorized" };
  }

  await db
    .update(users)
    .set({ termsAcceptedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return { ok: true };
}
