import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const SHORT_CODE_REGEX = /^\/[a-zA-Z0-9]{5,12}$/;

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Short code redirects: /xK9f2 → /api/redirect/xK9f2
  if (SHORT_CODE_REGEX.test(pathname)) {
    const code = pathname.slice(1);
    return NextResponse.rewrite(new URL(`/api/redirect/${code}`, request.url));
  }

  // Skip for API routes
  if (pathname.startsWith("/api")) return;

  // next-intl handles locale detection + internal rewrite to /[locale]/...
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
