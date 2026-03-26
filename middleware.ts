import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const SHORT_CODE_REGEX = /^\/[a-zA-Z0-9]{5,12}$/;

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Short codes → rewrite al route handler (máxima velocidad, sin layout)
  if (SHORT_CODE_REGEX.test(pathname)) {
    const code = pathname.slice(1);
    return NextResponse.rewrite(new URL(`/api/redirect/${code}`, request.url));
  }

  // 2. Rutas de API → pasar sin procesar
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Rutas protegidas → verificar sesión antes de pasar por next-intl
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. next-intl detecta idioma (cookie o Accept-Language) sin modificar la URL
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
