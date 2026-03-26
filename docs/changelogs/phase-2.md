# Phase 2 — Refactoring Completo (2026-03-26)

## Resumen
Refactoring completo del proyecto para corregir routing roto, eliminar complejidad innecesaria, enriquecer el schema de DB y establecer una UI minimalista estilo origami japonés con un único color de acento.

## Cambios

### Routing (Fix crítico)
- **Eliminada** carpeta `src/app/[locale]/` — causaba que Next.js tratara el locale como segmento URL.
- **Eliminado** `src/proxy.ts` — nunca fue ejecutado por Next.js (no era `middleware.ts`).
- **Creado** `middleware.ts` en la raíz del proyecto con las tres responsabilidades correctas:
  1. Rewrite de short codes (`/abc1234` → `/api/redirect/abc1234`).
  2. Protección de rutas (`/dashboard`, `/admin`) sin tocar la URL.
  3. Detección de locale via next-intl (cookie o Accept-Language) sin prefijo en URL.
- Todas las rutas ahora viven en `src/app/` directamente.

### Schema DB (Enriquecido)
- **`short_links`**: Eliminados `is_claimed` y `expires_at` (sin links anónimos). Agregados: `title`, `description`, `tags`, `custom_alias`, `password_hash`, `click_limit`, `click_count`.
- **`link_clicks`**: Agregados 13 campos nuevos: `session_id`, `is_bot`, `language`, `screen_width`, `screen_height`, `timezone`, `connection_type`, `link_button_index`, `duration`, `utm_source`, `utm_medium`, `utm_campaign`.
- **Nueva tabla `permissions`**: Catálogo RBAC con 14 permisos del sistema.
- **Nueva tabla `role_permissions`**: Asignación de permisos a roles — extensible sin tocar código.
- **Nueva tabla `rate_limit_entries`**: Rate limiting en PostgreSQL sin depender de Redis/Upstash.

### Rate Limiting (Sin Redis)
- Reescrito `src/lib/rate-limit.ts` — implementación en PostgreSQL con sliding window y lazy cleanup.
- Eliminada dependencia de Upstash. Variables de entorno `UPSTASH_*` ya no son requeridas.

### RBAC (Mejorado)
- Creado `src/lib/permissions.ts` con `hasPermission(role, permissionId)` — consulta `role_permissions` en DB con cache en memoria.
- Actualizado `src/lib/security.ts` con `requirePermission(permissionId)` usando el nuevo sistema.
- Permisos granulares: `links:create`, `links:read:own`, `links:read:all`, `links:update:own`, etc.

### Analytics (Enriquecido)
- `trackClick()` ahora captura: idioma (Accept-Language), session_id, detección de bots, UTM params.
- Incrementa `click_count` desnormalizado en `short_links` para queries rápidas de dashboard.

### Flujo de Usuario (Rediseñado)
- **Sin links anónimos**: Siempre requiere login para crear.
- **Home** (`/`): Input gigante → si no hay sesión → Google OAuth → wizard de creación.
- **Wizard** (`/create`): 3 pasos: elegir modo, personalizar (URL + título + alias), resultado con copia.
- **Dashboard** (`/dashboard`): Stats + lista de links con click count desnormalizado.
- **LinkHub** (`/hub/[code]`): Vista pública SSR de páginas de enlaces.

### UI/UX (Estética Origami)
- **Principio**: Blanco dominante (#FFFFFF / #F9F9F9), acento único beni (#B94047), patrones wagara 2-3% opacidad.
- Navbar con fondo `white/80` + `backdrop-blur`.
- Dashboard con bento de stats + lista de link cards con hover sutil.
- Páginas legales con contenido real (términos, privacidad).
- Sin gradientes de color, sin badges llamativos, sin múltiples colores.

### Simplificaciones
- Eliminados `claim-actions.ts`, constantes `ANON_LINK_LIMIT`, `ANON_LINK_TTL_HOURS`.
- `createLink` siempre requiere auth — código más simple y directo.
- `getUserLinks` usa `click_count` desnormalizado en lugar de subquery.

### Documentación
- `data-dictionary.md`: Actualizado con schema completo de Phase 2.
- `rbac-permissions.md`: Actualizado con catálogo de permisos granulares y matriz de roles.
- `changelogs/phase-2.md`: Este archivo.
