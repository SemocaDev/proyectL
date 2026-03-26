import { auth } from "./auth";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Role } from "./config";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new UnauthorizedError("Admin access required");
  }

  return session;
}

export async function verifyLinkOwnership(linkId: string) {
  const session = await requireAuth();

  const [link] = await db
    .select({ ownerId: shortLinks.ownerId })
    .from(shortLinks)
    .where(eq(shortLinks.id, linkId))
    .limit(1);

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }

  return session;
}

export function hasPermission(
  userRole: Role,
  requiredRole: Role
): boolean {
  if (requiredRole === "ADMIN") return userRole === "ADMIN";
  return true;
}
