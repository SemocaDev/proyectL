import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// App routes — any first path segment that belongs to the application.
// These MUST be excluded from short-code interception.
// When you add a new top-level route, add its segment here.
// ---------------------------------------------------------------------------
const APP_ROUTES = new Set([
  "api",
  "dashboard",
  "create",
  "admin",
  "legal",
  "_not-found",
]);

// Short codes: exactly 5-12 alphanumeric characters (base-62).
// Only matches single-segment paths that are NOT app routes.
const SHORT_CODE_REGEX = /^\/([a-zA-Z0-9]{5,12})$/;

const LOCALES = ["es", "en"] as const;
const DEFAULT_LOCALE = "es";

function hasSession(request: NextRequest): boolean {
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");
  return !!sessionCookie?.value;
}

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }
  const acceptLang = request.headers.get("accept-language") ?? "";
  for (const locale of LOCALES) {
    if (acceptLang.toLowerCase().startsWith(locale)) return locale;
  }
  return DEFAULT_LOCALE;
}

// Helper: inject locale header into the request for next-intl/server
function withLocale(request: NextRequest): NextResponse {
  const locale = detectLocale(request);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-NEXT-INTL-LOCALE", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Extract first path segment to decide routing
  const firstSegment = pathname.split("/")[1] ?? "";

  // 2. App routes — let Next.js handle them normally
  if (APP_ROUTES.has(firstSegment)) {
    // 2a. Protected routes → verify session cookie (optimistic check)
    const isProtected =
      firstSegment === "dashboard" || firstSegment === "admin";

    if (isProtected && !hasSession(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return withLocale(request);
  }

  // 3. Short code interception → rewrite to the [code] dynamic page
  //    The [code] page handles both redirect and linkhub modes server-side.
  const match = SHORT_CODE_REGEX.exec(pathname);
  if (match) {
    // No rewrite needed — the [code] dynamic route handles it directly.
    // Just pass through with locale header.
    return withLocale(request);
  }

  // 4. Everything else (home, static assets that passed matcher, etc.)
  return withLocale(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
