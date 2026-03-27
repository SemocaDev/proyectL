# Diccionario de Datos — DevMinds Links

## Base de Datos

### Tabla: `users`
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Identificador único del usuario |
| name | varchar(255) | Sí | null | Nombre del usuario (de Google) |
| email | varchar(255) | No | — | Email único del usuario |
| email_verified | timestamp | Sí | null | Fecha de verificación del email |
| image | text | Sí | null | URL del avatar (Google) |
| role | enum(USER, ADMIN) | No | USER | Rol del usuario para RBAC |
| created_at | timestamp | No | now() | Fecha de creación |
| updated_at | timestamp | No | now() | Última actualización (auto) |

### Tabla: `accounts` (Auth.js)
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| user_id | uuid (FK → users.id) | No | — | Usuario al que pertenece |
| type | varchar(255) | No | — | Tipo de cuenta (oauth, etc.) |
| provider | varchar(255) | No | — | Proveedor (google) |
| provider_account_id | varchar(255) | No | — | ID en el proveedor |
| refresh_token | text | Sí | null | Token de refresh |
| access_token | text | Sí | null | Token de acceso |
| expires_at | integer | Sí | null | Expiración del token (unix) |
| token_type | varchar(255) | Sí | null | Tipo de token |
| scope | varchar(255) | Sí | null | Scope del OAuth |
| id_token | text | Sí | null | ID token JWT |
| session_state | varchar(255) | Sí | null | Estado de sesión |
| **PK** | (provider, provider_account_id) | | | Clave primaria compuesta |

### Tabla: `sessions` (Auth.js)
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| session_token | varchar(255) | No | — | Token de sesión (PK) |
| user_id | uuid (FK → users.id) | No | — | Usuario de la sesión |
| expires | timestamp | No | — | Fecha de expiración |

### Tabla: `verification_tokens` (Auth.js)
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| identifier | varchar(255) | No | — | Identificador (email) |
| token | varchar(255) | No | — | Token de verificación |
| expires | timestamp | No | — | Fecha de expiración |
| **PK** | (identifier, token) | | | Clave primaria compuesta |

### Tabla: `permissions` (RBAC — catálogo)
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | varchar(50) | No | — | ID del permiso (PK) — formato: "resource:action:scope" |
| description | text | Sí | null | Descripción legible |
| resource | varchar(50) | No | — | Recurso (links, analytics, reports, users) |
| action | varchar(50) | No | — | Acción (create, read, update, delete, disable, resolve) |
| scope | varchar(20) | No | — | Alcance (own, all, any) |

### Tabla: `role_permissions` (RBAC — asignación)
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| role | enum(USER, ADMIN) | No | — | Rol (PK compuesta) |
| permission_id | varchar(50) (FK → permissions.id) | No | — | Permiso asignado (PK compuesta) |

### Tabla: `rate_limit_entries`
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Identificador único |
| key | varchar(255) | No | — | Clave del límite (ej. "create:user_id", "redirect:ip:code") |
| count | integer | No | 1 | Número de requests en la ventana actual |
| window_start | timestamp | No | now() | Inicio de la ventana de tiempo |
| expires_at | timestamp | No | — | Expiración de la entrada (lazy cleanup) |

### Tabla: `short_links`
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Identificador único |
| short_code | varchar(12) | No | — | Código corto (único, indexado) |
| owner_id | uuid (FK → users.id) | No | — | Dueño (requerido — sin links anónimos) |
| mode | enum(redirect, linkhub) | No | redirect | Modo de funcionamiento |
| target_url | text | Sí | null | URL destino (modo redirect) |
| landing_data | jsonb | Sí | null | Config del LinkHub (título, bio, links, tema) |
| title | varchar(100) | Sí | null | Título descriptivo del link |
| description | varchar(300) | Sí | null | Descripción opcional |
| tags | text[] | Sí | null | Array de etiquetas para organización |
| custom_alias | varchar(50) | Sí | null | Alias personalizado (premium future-ready) |
| password_hash | varchar(255) | Sí | null | Hash de contraseña de protección (future-ready) |
| click_limit | integer | Sí | null | Máximo de clicks antes de desactivar (null = ilimitado) |
| click_count | integer | No | 0 | Contador desnormalizado de clicks (performance) |
| status | enum(active, disabled, flagged) | No | active | Estado de moderación |
| created_at | timestamp | No | now() | Fecha de creación |
| updated_at | timestamp | No | now() | Última actualización (auto) |

### Tabla: `link_clicks`
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Identificador único |
| link_id | uuid (FK → short_links.id) | No | — | Link al que pertenece el click |
| timestamp | timestamp | No | now() | Momento exacto del click |
| ip_hash | varchar(64) | Sí | null | SHA256 de la IP (16 chars) — nunca texto plano |
| session_id | varchar(64) | Sí | null | Hash de (ip+ua+fecha) para agrupar sesiones |
| is_bot | boolean | Sí | false | Detectado como bot por user-agent |
| country | varchar(2) | Sí | null | Código de país ISO (ej. CO, US) |
| city | varchar(100) | Sí | null | Ciudad (de Vercel GeoIP headers) |
| region | varchar(100) | Sí | null | Región/Estado |
| referer | text | Sí | null | Hostname de procedencia (ej. twitter.com) |
| user_agent | text | Sí | null | User-Agent completo (truncado a 500 chars) |
| language | varchar(10) | Sí | null | Primer locale de Accept-Language (ej. "es-CO") |
| device_type | varchar(20) | Sí | null | mobile, desktop, tablet |
| browser_name | varchar(50) | Sí | null | Chrome, Safari, Firefox, Edge, Opera |
| os_name | varchar(50) | Sí | null | Windows, macOS, Linux, Android, iOS |
| screen_width | integer | Sí | null | Ancho de pantalla en px (solo LinkHub, via JS) |
| screen_height | integer | Sí | null | Alto de pantalla en px (solo LinkHub, via JS) |
| timezone | varchar(50) | Sí | null | Timezone del visitante (solo LinkHub) |
| connection_type | varchar(20) | Sí | null | wifi, 4g, 3g, ethernet (solo LinkHub) |
| link_button_index | integer | Sí | null | Índice del botón clickeado en LinkHub (0-based) |
| duration | integer | Sí | null | Tiempo en página en ms (solo LinkHub) |
| utm_source | varchar(100) | Sí | null | Parámetro UTM de la URL |
| utm_medium | varchar(100) | Sí | null | Parámetro UTM medium |
| utm_campaign | varchar(100) | Sí | null | Parámetro UTM campaign |

### Tabla: `reports`
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Identificador único |
| link_id | uuid (FK → short_links.id) | No | — | Link reportado |
| reported_by | uuid (FK → users.id) | Sí | null | Quién reportó (null = anónimo) |
| reason | text | No | — | Motivo del reporte |
| status | enum(pending, resolved, dismissed) | No | pending | Estado del reporte |
| created_at | timestamp | No | now() | Fecha del reporte |

---

## Constantes de Configuración (`src/lib/config.ts`)

| Variable | Tipo | Valor | Descripción |
|----------|------|-------|-------------|
| SITE_URL | string | https://l.devminds.online | URL base del sitio en producción |
| DEVMINDS_URL | string | https://www.devminds.online/ | URL del sitio principal de DevMinds |
| SHORT_DOMAIN | string | l.devminds.online | Dominio corto para links |
| USER_LINK_LIMIT | number | 50 | Máximo de links por usuario registrado |
| SHORT_CODE_LENGTH | number | 7 | Longitud del código corto generado |
| ROLES | tuple | ["USER", "ADMIN"] | Roles disponibles en el sistema |

## Rate Limiting (`src/lib/rate-limit.ts`)

| Constante | Límite | Ventana | Clave | Descripción |
|-----------|--------|---------|-------|-------------|
| CREATE_AUTH | 10 | 1 minuto | `create:{userId}` | Crear links — usuario autenticado |
| REDIRECT | 100 | 1 minuto | `redirect:{ip}:{code}` | Redirecciones por IP y código |
| AUTH | 5 | 1 minuto | `auth:{ip}` | Intentos de login por IP |

---

## Variables de Entorno

| Variable | Tipo | Requerida | Descripción |
|----------|------|-----------|-------------|
| DATABASE_URL | string | Sí | Connection string de PostgreSQL (Neon) |
| AUTH_SECRET | string | Sí | Secreto para Auth.js (generar con `openssl rand -base64 32`) |
| AUTH_GOOGLE_ID | string | Sí | Google OAuth Client ID |
| AUTH_GOOGLE_SECRET | string | Sí | Google OAuth Client Secret |
| AUTH_URL | string | Sí | URL base para Auth.js (http://localhost:3000 en dev) |
| NEXT_PUBLIC_APP_URL | string | Sí | URL pública de la app |
| NEXT_PUBLIC_SHORT_DOMAIN | string | Sí | Dominio corto para generar URLs |

---

## Schemas de Validación Zod (`src/lib/schemas.ts`)

| Schema | Campo | Tipo | Restricciones |
|--------|-------|------|---------------|
| createLinkSchema | targetUrl | string | url(), max 2048 |
| createLinkSchema | mode | enum | "redirect" \| "linkhub" |
| createLinkSchema | title | string? | max 100 |
| updateLinkSchema | targetUrl | string? | url(), max 2048 |
| updateLinkSchema | mode | enum? | "redirect" \| "linkhub" |
| updateLinkSchema | landingData | object? | Ver landingDataSchema |
| reportLinkSchema | linkId | string | uuid() |
| reportLinkSchema | reason | string | min 10, max 1000 |
| landingDataSchema | title | string? | max 100 |
| landingDataSchema | bio | string? | max 300 |
| landingDataSchema | links | array? | max 20 items, cada uno con label (max 50) y url |
| landingDataSchema | theme | object? | accentColor, bgColor |
