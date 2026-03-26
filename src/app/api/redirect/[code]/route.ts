import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { trackClick } from "@/lib/analytics";
import { checkRateLimit, redirectLimiter } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(redirectLimiter, ip);

  if (!success) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(
      and(eq(shortLinks.shortCode, code), eq(shortLinks.status, "active"))
    )
    .limit(1);

  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return new NextResponse("Link expired", { status: 410 });
  }

  void trackClick(link.id, request);

  if (link.mode === "redirect" && link.targetUrl) {
    return NextResponse.redirect(link.targetUrl, 301);
  }

  return NextResponse.redirect(new URL(`/hub/${code}`, request.url));
}
