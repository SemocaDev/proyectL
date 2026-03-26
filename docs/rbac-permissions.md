# RBAC — Roles, Permisos y Endpoints

## Roles

| Rol | Descripción | Asignación |
|-----|-------------|------------|
| USER | Usuario registrado. Puede crear, editar y eliminar sus propios links. | Default al registrarse |
| ADMIN | Acceso total. Moderación de links y reportes de todos los usuarios. | Manual en DB |

---

## Matriz de Permisos

| Acción | ANÓNIMO | USER | ADMIN |
|--------|---------|------|-------|
| Crear link (redirect) | ✅ (5/24h, expira en 24h) | ✅ (50 max) | ✅ (ilimitado) |
| Crear link (linkhub) | ✅ (5/24h, expira en 24h) | ✅ (50 max) | ✅ (ilimitado) |
| Ver link público | ✅ | ✅ | ✅ |
| Reclamar link anónimo | ❌ | ✅ (si owner_id IS NULL) | ✅ |
| Ver propios links | ❌ | ✅ | ✅ |
| Editar propio link | ❌ | ✅ | ✅ |
| Eliminar propio link | ❌ | ✅ | ✅ |
| Ver analytics propios | ❌ | ✅ | ✅ |
| Ver TODOS los links | ❌ | ❌ | ✅ |
| Deshabilitar link ajeno | ❌ | ❌ | ✅ |
| Marcar (flag) link | ❌ | ❌ | ✅ |
| Reportar un link | ✅ | ✅ | ✅ |
| Ver reportes | ❌ | ❌ | ✅ |
| Resolver/descartar reporte | ❌ | ❌ | ✅ |

---

## Protección de Rutas

| Ruta | Acceso | Guard |
|------|--------|-------|
| `/` | Público | — |
| `/create/confirmation` | Público | — |
| `/dashboard` | USER, ADMIN | `dashboard/layout.tsx` → `auth()` |
| `/admin` | ADMIN | `admin/layout.tsx` → `auth()` + `role === "ADMIN"` |
| `/admin/links` | ADMIN | Hereda de `/admin/layout.tsx` |
| `/admin/reports` | ADMIN | Hereda de `/admin/layout.tsx` |
| `/legal/*` | Público | — |
| `/[code]` | Público | — (Route Handler) |
| `/api/auth/*` | Público | Auth.js handlers |

---

## Rate Limiting por Endpoint

| Endpoint/Acción | Límite Anónimo | Límite Autenticado | Identificador |
|-----------------|----------------|-------------------|---------------|
| Crear link | 5 / 24h | 10 / 1min | IP / User ID |
| Redirect `/[code]` | 60 / 1min | 60 / 1min | IP |
| Auth (login) | 5 / 1min | — | IP |

---

## Server Actions y Permisos

| Action | Archivo | Requiere Auth | Requiere Admin | Verifica Ownership |
|--------|---------|---------------|----------------|-------------------|
| `createLink` | link-actions.ts | No (soporta anónimos) | No | — |
| `deleteLink` | link-actions.ts | Sí | No | Sí |
| `updateLink` | link-actions.ts | Sí | No | Sí |
| `getUserLinks` | link-actions.ts | Sí | No | Filtra por owner_id |
| `claimLink` | claim-actions.ts | Sí | No | Verifica owner_id IS NULL |
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
| `hasPermission(userRole, requiredRole)` | Check simple de permisos | No lanza, retorna boolean |
