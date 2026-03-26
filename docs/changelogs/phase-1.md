# Phase 1 — Cimientos (2026-03-26)

## Resumen
Inicialización completa del proyecto DevMinds Links (proyectL). Se establecieron todos los cimientos: scaffolding, DB schema, auth, i18n, seguridad, rate limiting, analytics y componentes base.

## Cambios

### Scaffolding
- Proyecto Next.js 16 con App Router, TypeScript strict, Tailwind CSS v4
- shadcn/ui (new-york) con componentes: button, input, card, badge, separator, label, dropdown-menu, avatar, dialog, sonner, sheet, textarea
- Fuentes: Inter (body) + Doto (branding DevMinds)

### Base de Datos (Drizzle ORM + Neon)
- Schema completo: `users`, `accounts`, `sessions`, `verification_tokens`, `short_links`, `link_clicks`, `reports`
- Enums: `user_role`, `link_mode`, `link_status`, `report_status`
- Indexes compuestos en `link_clicks` (link_id + timestamp)
- Schema pusheado exitosamente a Neon PostgreSQL

### Auth (Auth.js v5)
- Google OAuth provider con DrizzleAdapter
- Session callback extiende con `role` del usuario
- Type declarations para Session y User con `role`

### Internacionalización (next-intl)
- `localePrefix: "never"` — URLs limpias sin `/es` o `/en`
- Detección por cookie/Accept-Language header
- Mensajes completos en `messages/es.json` y `messages/en.json`
- Namespaces: meta, nav, home, create, dashboard, admin, legal, common, footer

### Rutas (App Router)
- `/` — Home con input gigante
- `/create/confirmation` — Wizard post-creación
- `/dashboard` — Panel usuario (auth guard)
- `/admin/*` — Panel admin (role guard: ADMIN only)
- `/legal/terms`, `/legal/privacy` — Páginas legales
- `/[code]` — Route Handler para redirects (sin layout, máxima velocidad)

### Seguridad
- `requireAuth()`, `requireAdmin()`, `verifyLinkOwnership()` helpers
- Rate limiters: anon create (5/24h), auth create (10/min), redirect (60/min), auth (5/min)
- Graceful degradation si Redis no está configurado

### Analytics
- `trackClick()` — captura IP hash (SHA256), geo (Vercel headers), user-agent parsing, referer
- Fire-and-forget: no bloquea la redirección
- Parseo de device type, browser name, OS name via regex

### Componentes
- `WagaraPattern` — 5 patrones japoneses (seigaiha, shippo, asanoha, ichimatsu, ryusuimon) con Framer Motion
- `DevMindsCredit` — Branding con fuente Doto
- `Footer`, `Navbar`, `LanguageSwitcher`
- `SignInButton`, `UserMenu` (auth components)
- `FadeIn`, `StaggerContainer`, `StaggerItem`, `ScaleOnHover` (motion wrappers)

### Server Actions
- `createLink` — Validación Zod + rate limit + conteo de límites + generación de short code
- `deleteLink`, `updateLink` — Con ownership verification
- `getUserLinks` — Con click count subquery
- `claimLink` — Solo si owner_id IS NULL + límite de usuario
- Admin: `flagLink`, `disableLink`, `enableLink`, `resolveReport`, `getAllLinks`, `getAllReports`

### Tema Visual
- Paleta japonesa: shironeri, sumi, ginnezumi, hai, beni, shu, ai, uguisu
- Mapeado a variables shadcn (--primary=beni, --destructive=shu, --accent=ai)
- Sin dark mode (estética luminosa Wabi-Sabi)
