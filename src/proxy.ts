import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { type NextRequest } from "next/server";

const SHORT_CODE_REGEX = /^\/[a-zA-Z0-9]{5,12}$/;

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SHORT_CODE_REGEX.test(pathname)) return;
  if (pathname.startsWith("/api")) return;

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
