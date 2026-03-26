import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const SHORT_CODE_REGEX = /^\/[a-zA-Z0-9]{5,12}$/;

const intlMiddleware = createMiddleware(routing);

/**
 * Verifica si hay sesión activa leyendo la cookie de NextAuth.
 * Proxy en Next.js 16 corre en Node.js runtime por defecto.
 */
function hasSession(request: NextRequest): boolean {
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  return !!sessionCookie?.value;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Short codes → rewrite al route handler
  if (SHORT_CODE_REGEX.test(pathname)) {
    const code = pathname.slice(1);
    return NextResponse.rewrite(new URL(`/api/redirect/${code}`, request.url));
  }

  // 2. Rutas de API → pasar sin procesar
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Rutas protegidas → verificar cookie de sesión
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected && !hasSession(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. next-intl detecta idioma sin modificar la URL
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
