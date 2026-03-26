# RBAC — Roles, Permisos y Endpoints

## Roles

| Rol | Descripción | Asignación |
|-----|-------------|------------|
| USER | Usuario registrado. Puede crear, editar y eliminar sus propios links. | Default al registrarse con Google |
| ADMIN | Acceso total. Moderación de links y reportes de todos los usuarios. | Manual en DB |

> **Extensibilidad:** Para agregar un rol MODERATOR en el futuro, solo se insertan filas en `role_permissions` — sin cambiar código.

---

## Catálogo de Permisos (`permissions` table)

| Permission ID | Resource | Action | Scope | Descripción |
|---|---|---|---|---|
| `links:create` | links | create | own | Crear links propios |
| `links:read:own` | links | read | own | Ver links propios |
| `links:read:all` | links | read | all | Ver todos los links (admin) |
| `links:update:own` | links | update | own | Editar links propios |
| `links:update:any` | links | update | any | Editar cualquier link (admin) |
| `links:delete:own` | links | delete | own | Eliminar links propios |
| `links:delete:any` | links | delete | any | Eliminar cualquier link (admin) |
| `links:disable:any` | links | disable | any | Deshabilitar cualquier link (admin) |
| `analytics:read:own` | analytics | read | own | Ver analytics propios |
| `analytics:read:all` | analytics | read | all | Ver todos los analytics (admin) |
| `reports:create` | reports | create | any | Reportar links |
| `reports:read:all` | reports | read | all | Ver todos los reportes (admin) |
| `reports:resolve` | reports | resolve | all | Resolver/descartar reportes (admin) |
| `users:read:all` | users | read | all | Ver todos los usuarios (admin) |

---

## Matriz de Permisos por Rol

| Acción | USER | ADMIN |
|--------|------|-------|
| Crear link | ✅ | ✅ |
| Ver propios links | ✅ | ✅ |
| Ver TODOS los links | ❌ | ✅ |
| Editar propio link | ✅ | ✅ |
| Editar link ajeno | ❌ | ✅ |
| Eliminar propio link | ✅ | ✅ |
| Eliminar link ajeno | ❌ | ✅ |
| Ver analytics propios | ✅ | ✅ |
| Ver TODOS los analytics | ❌ | ✅ |
| Reportar un link | ✅ | ✅ |
| Ver reportes | ❌ | ✅ |
| Resolver/descartar reporte | ❌ | ✅ |
| Deshabilitar link ajeno | ❌ | ✅ |
| Ver lista de usuarios | ❌ | ✅ |

---

## Protección de Rutas

| Ruta | Acceso | Guard |
|------|--------|-------|
| `/` | Público | — |
| `/create` | Requiere auth | `middleware.ts` → redirect a `/` |
| `/dashboard` | USER, ADMIN | `middleware.ts` → redirect a `/` |
| `/admin` | ADMIN | `middleware.ts` → redirect a `/dashboard` |
| `/admin/links` | ADMIN | Hereda de `/admin` guard |
| `/admin/reports` | ADMIN | Hereda de `/admin` guard |
| `/legal/*` | Público | — |
| `/hub/[code]` | Público | — |
| `/[code]` | Público | middleware rewrite → `/api/redirect/[code]` |
| `/api/auth/*` | Público | Auth.js handlers |

---

## Rate Limiting por Endpoint

Implementado en PostgreSQL (`rate_limit_entries`), sin Redis.

| Endpoint/Acción | Límite | Ventana | Identificador |
|-----------------|--------|---------|---------------|
| Crear link | 10 | 1 minuto | `create:{userId}` |
| Redirect `/[code]` | 100 | 1 minuto | `redirect:{ip}:{code}` |
| Auth (login) | 5 | 1 minuto | `auth:{ip}` |

---

## Server Actions y Permisos

| Action | Archivo | Requiere Auth | Requiere Admin | Verifica Ownership |
|--------|---------|---------------|----------------|-------------------|
| `createLink` | link-actions.ts | Sí | No | — |
| `deleteLink` | link-actions.ts | Sí | No | Sí |
| `updateLink` | link-actions.ts | Sí | No | Sí |
| `getUserLinks` | link-actions.ts | Sí | No | Filtra por owner_id |
| `flagLink` | admin-actions.ts | Sí | Sí | — |
| `disableLink` | admin-actions.ts | Sí | Sí | — |
| `enableLink` | admin-actions.ts | Sí | Sí | — |
| `resolveReport` | admin-actions.ts | Sí | Sí | — |
| `getAllLinks` | admin-actions.ts | Sí | Sí | — |
| `getAllReports` | admin-actions.ts | Sí | Sí | — |

---

## Helpers de Seguridad (`src/lib/security.ts`)

| Helper | Descripción | Lanza Error |
|--------|-------------|-------------|
| `requireAuth()` | Verifica sesión activa, retorna session | `UnauthorizedError` si no hay sesión |
| `requireAdmin()` | Verifica sesión + role ADMIN | `UnauthorizedError` si no es admin |
| `verifyLinkOwnership(linkId)` | Verifica que el link pertenece al usuario actual (o es admin) | `UnauthorizedError` o `Error("Link not found")` |
| `requirePermission(permissionId)` | Verifica permiso RBAC usando `role_permissions` | `UnauthorizedError` si no tiene permiso |

## Helper de Permisos (`src/lib/permissions.ts`)

| Helper | Descripción |
|--------|-------------|
| `hasPermission(role, permissionId)` | Consulta `role_permissions` en DB con cache en memoria por proceso |
| `invalidatePermissionCache(role?)` | Invalida el cache (útil si cambian permisos en runtime) |
