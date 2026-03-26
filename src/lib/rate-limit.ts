import { db } from "@/db";
import { rateLimitEntries } from "@/db/schema";
import { and, eq, gt, lt, sql } from "drizzle-orm";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp (ms) cuando el límite se resetea
}

/**
 * Sliding window rate limiter usando PostgreSQL.
 * No requiere Redis ni servicios externos.
 *
 * @param key       Identificador único (ej. "create:user_123" o "redirect:ip_hash")
 * @param limit     Número máximo de requests permitidos en la ventana
 * @param windowMs  Tamaño de la ventana en milisegundos
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);

  try {
    // Lazy cleanup: eliminar entradas expiradas para este key
    await db
      .delete(rateLimitEntries)
      .where(and(eq(rateLimitEntries.key, key), lt(rateLimitEntries.expiresAt, now)));

    // Buscar entrada vigente
    const [existing] = await db
      .select()
      .from(rateLimitEntries)
      .where(and(eq(rateLimitEntries.key, key), gt(rateLimitEntries.expiresAt, now)))
      .limit(1);

    if (!existing) {
      // Primera request en esta ventana — insertar
      await db.insert(rateLimitEntries).values({
        key,
        count: 1,
        windowStart: now,
        expiresAt,
      });
      return { success: true, remaining: limit - 1, reset: expiresAt.getTime() };
    }

    if (existing.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: existing.expiresAt.getTime(),
      };
    }

    // Incrementar contador
    await db
      .update(rateLimitEntries)
      .set({ count: sql`${rateLimitEntries.count} + 1` })
      .where(eq(rateLimitEntries.id, existing.id));

    return {
      success: true,
      remaining: limit - existing.count - 1,
      reset: existing.expiresAt.getTime(),
    };
  } catch {
    // En caso de error de DB, dejar pasar para no bloquear al usuario
    return { success: true, remaining: limit, reset: expiresAt.getTime() };
  }
}

// ─── Presets de límites ───────────────────────────────────────────────────────

export const LIMITS = {
  /** Crear links — usuario autenticado: 10/minuto */
  CREATE_AUTH: { limit: 10, windowMs: 60_000 },
  /** Redirect — por IP: 100/minuto por código */
  REDIRECT: { limit: 100, windowMs: 60_000 },
  /** Login — por IP: 5/minuto */
  AUTH: { limit: 5, windowMs: 60_000 },
} as const;
