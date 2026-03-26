import { auth } from "./auth";
import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hasPermission } from "./permissions";
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

/**
 * Verifica que el usuario actual es dueño del link.
 * Los ADMIN pueden acceder a cualquier link.
 */
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

  const isOwner = link.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new UnauthorizedError("You do not own this link");
  }

  return { session, link };
}

/**
 * Verifica permiso RBAC para el usuario de la sesión actual.
 */
export async function requirePermission(permissionId: string) {
  const session = await requireAuth();
  const allowed = await hasPermission(session.user.role as Role, permissionId);

  if (!allowed) {
    throw new UnauthorizedError(`Missing permission: ${permissionId}`);
  }

  return session;
}
