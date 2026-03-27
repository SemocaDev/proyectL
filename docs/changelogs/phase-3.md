# Phase 3 — Routing Fix & Architecture Cleanup (2026-03-26)

## Problema Raíz

Todas las páginas excepto `/` daban **404** en runtime (el build era exitoso).

**Causa**: `proxy.ts` usaba `SHORT_CODE_REGEX = /^\/[a-zA-Z0-9]{5,12}$/` para interceptar short codes. Rutas como `/dashboard` (9 chars), `/create` (6 chars), `/admin` (5 chars) caían dentro del rango 5-12 y eran reescritas a `/api/redirect/dashboard`, que no existía en DB → 404.

## Cambios

### 1. Proxy.ts — Reescrito desde cero

**Antes**: El regex de short codes se evaluaba primero, capturando rutas legítimas de la app.

**Ahora**: Se mantiene un `Set` de rutas reservadas (`APP_ROUTES`) que se evalúa **antes** del regex de short codes.

```
Flujo del proxy:
1. Extraer primer segmento del path
2. ¿Es ruta de la app? → Pasar directo (con protección de sesión si aplica)
3. ¿Coincide con regex de short code? → Pasar al [code] dinámico
4. Todo lo demás → Pasar con locale header
```

**Importante**: Al agregar nuevas rutas top-level, se debe agregar el segmento a `APP_ROUTES` en `src/proxy.ts`.

### 2. Ruta Unificada `/[code]` — Sin `/hub/[code]` ni `/api/redirect/[code]`

**Antes**: 3 archivos para manejar un short code:
- `proxy.ts` reescribía a `/api/redirect/[code]` (route handler)
- `/api/redirect/[code]/route.ts` hacía la DB query y redirigía o enviaba a `/hub/[code]`
- `/hub/[code]/page.tsx` renderizaba el modo linkhub

**Ahora**: 1 archivo `src/app/[code]/page.tsx` (Server Component):
- Query directa a DB
- Rate limiting
- Tracking de clicks (fire-and-forget)
- `redirect()` para modo redirect
- Renderiza linkhub directamente para modo linkhub
- Misma URL para ambos modos: `l.devminds.online/AbCdEfG`

### 3. i18n — Language Switcher sin Redirect

**Antes**: `LanguageSwitcher` usaba `router.replace(pathname, { locale })` de next-intl/navigation → causaba navegación/redirect.

**Ahora**: Establece cookie `NEXT_LOCALE` y llama `router.refresh()` → recarga in-place sin cambiar URL.

**Eliminado**: `src/i18n/navigation.ts` — ya no se necesitan los wrappers de next-intl para navegación.

### 4. Analytics Utils — Extraídos a módulo compartido

`src/lib/analytics-utils.ts` contiene las funciones puras: `hashIP()`, `cleanReferer()`, `parseUserAgent()`.

Reutilizadas tanto por `analytics.ts` (para route handlers) como por `[code]/page.tsx` (para server components).

### 5. Archivos Eliminados

- `src/app/hub/[code]/page.tsx` — reemplazado por `src/app/[code]/page.tsx`
- `src/app/api/redirect/[code]/route.ts` — lógica movida a `[code]/page.tsx`
- `src/i18n/navigation.ts` — ya no se usa

## Short Codes — Cómo Funcionan

| Aspecto | Valor |
|---------|-------|
| Longitud | 7 caracteres (configurable en `config.ts`) |
| Alfabeto | `A-Z a-z 0-9` (62 caracteres) |
| Combinaciones únicas | 62^7 = **3.52 billones** |
| Generación | `crypto.getRandomValues()` (criptográficamente seguro) |
| Unicidad | Verificación en DB con 5 reintentos |
| Regex en proxy | `/^\/([a-zA-Z0-9]{5,12})$/` |

### Probabilidad de Colisión

Con 62^7 = 3,521,614,606,208 combinaciones posibles:
- Con 1 millón de links: ~0.000028% de colisión por intento
- Con 10 millones de links: ~0.00028% de colisión por intento
- El sistema reintenta hasta 5 veces si hay colisión

## Verificación

Todas las rutas probadas en dev server:

| Ruta | Status | Comportamiento |
|------|--------|----------------|
| `/` | 200 | Home pública |
| `/create` | 200 | Wizard de creación |
| `/dashboard` | 307 → `/` | Redirige sin sesión (correcto) |
| `/admin` | 307 → `/` | Redirige sin sesión (correcto) |
| `/legal/terms` | 200 | Página de términos |
| `/legal/privacy` | 200 | Página de privacidad |
| `/AbCdEfG` | [code] page | Busca en DB, redirige o muestra linkhub |
