import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { trackClick } from "@/lib/analytics";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success } = await checkRateLimit(
    `redirect:${ip}:${code}`,
    LIMITS.REDIRECT.limit,
    LIMITS.REDIRECT.windowMs
  );

  if (!success) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(and(eq(shortLinks.shortCode, code), eq(shortLinks.status, "active")))
    .limit(1);

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Verificar límite de clicks si está configurado
  if (link.clickLimit !== null && link.clickCount >= link.clickLimit) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Registrar click de forma asíncrona — no bloquea la redirección
  void trackClick(link.id, request);

  if (link.mode === "redirect" && link.targetUrl) {
    return NextResponse.redirect(link.targetUrl, { status: 301 });
  }

  // Modo LinkHub → renderizar página
  return NextResponse.redirect(new URL(`/hub/${code}`, request.url));
}
