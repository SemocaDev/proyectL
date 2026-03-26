import { db } from "@/db";
import { rolePermissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Role } from "./config";

// Cache en memoria por proceso — se invalida en cada deploy
const permissionCache = new Map<string, Set<string>>();

/**
 * Obtiene los permisos de un rol. Usa cache en memoria para no
 * consultar la DB en cada request.
 */
async function getPermissionsForRole(role: Role): Promise<Set<string>> {
  if (permissionCache.has(role)) {
    return permissionCache.get(role)!;
  }

  const rows = await db
    .select({ permissionId: rolePermissions.permissionId })
    .from(rolePermissions)
    .where(eq(rolePermissions.role, role));

  const perms = new Set(rows.map((r) => r.permissionId));
  permissionCache.set(role, perms);
  return perms;
}

/**
 * Verifica si un rol tiene un permiso específico.
 *
 * @example
 * const ok = await hasPermission("USER", "links:create");
 * const ok = await hasPermission("ADMIN", "links:read:all");
 */
export async function hasPermission(
  role: Role,
  permissionId: string
): Promise<boolean> {
  const perms = await getPermissionsForRole(role);
  return perms.has(permissionId);
}

/** Invalida el cache (útil si los permisos cambian en runtime) */
export function invalidatePermissionCache(role?: Role) {
  if (role) {
    permissionCache.delete(role);
  } else {
    permissionCache.clear();
  }
}
