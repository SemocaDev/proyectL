import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
export const linkModeEnum = pgEnum("link_mode", ["redirect", "linkhub"]);
export const linkStatusEnum = pgEnum("link_status", [
  "active",
  "disabled",
  "flagged",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "resolved",
  "dismissed",
]);

// ─── Auth.js Required Tables ─────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccountType>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 })
    .primaryKey()
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─── RBAC: Permisos y Roles ───────────────────────────────────────────────────

export const permissions = pgTable("permissions", {
  id: varchar("id", { length: 50 }).primaryKey(),
  description: text("description"),
  resource: varchar("resource", { length: 50 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  scope: varchar("scope", { length: 20 }).notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    role: userRoleEnum("role").notNull(),
    permissionId: varchar("permission_id", { length: 50 })
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.role, t.permissionId] })]
);

// ─── Rate Limiting (sin Redis) ────────────────────────────────────────────────

export const rateLimitEntries = pgTable(
  "rate_limit_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    count: integer("count").default(1).notNull(),
    windowStart: timestamp("window_start", { mode: "date" }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    index("rate_limit_key_idx").on(table.key),
    index("rate_limit_expires_idx").on(table.expiresAt),
  ]
);

// ─── Application Tables ──────────────────────────────────────────────────────

export const shortLinks = pgTable(
  "short_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shortCode: varchar("short_code", { length: 12 }).unique().notNull(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: linkModeEnum("mode").default("redirect").notNull(),
    targetUrl: text("target_url"),
    landingData: jsonb("landing_data"),
    // Metadatos adicionales del link
    title: varchar("title", { length: 100 }),
    description: varchar("description", { length: 300 }),
    tags: text("tags").array(),
    customAlias: varchar("custom_alias", { length: 50 }),
    passwordHash: varchar("password_hash", { length: 255 }),
    clickLimit: integer("click_limit"),
    clickCount: integer("click_count").default(0).notNull(),
    status: linkStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("short_links_short_code_idx").on(table.shortCode),
    index("short_links_owner_id_idx").on(table.ownerId),
    index("short_links_status_idx").on(table.status),
    index("short_links_custom_alias_idx").on(table.customAlias),
  ]
);

export const linkClicks = pgTable(
  "link_clicks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    linkId: uuid("link_id")
      .notNull()
      .references(() => shortLinks.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),

    // Identidad y privacidad
    ipHash: varchar("ip_hash", { length: 64 }),
    sessionId: varchar("session_id", { length: 64 }),
    isBot: boolean("is_bot").default(false),

    // Geografía (via Vercel headers)
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 100 }),
    region: varchar("region", { length: 100 }),

    // Contexto de navegación
    referer: text("referer"),
    userAgent: text("user_agent"),
    language: varchar("language", { length: 10 }),

    // Dispositivo (parseado del user-agent)
    deviceType: varchar("device_type", { length: 20 }),
    browserName: varchar("browser_name", { length: 50 }),
    osName: varchar("os_name", { length: 50 }),

    // Pantalla (solo disponible en LinkHub via JS)
    screenWidth: integer("screen_width"),
    screenHeight: integer("screen_height"),
    timezone: varchar("timezone", { length: 50 }),
    connectionType: varchar("connection_type", { length: 20 }),

    // Interacción (solo LinkHub)
    linkButtonIndex: integer("link_button_index"),
    duration: integer("duration"),

    // UTM tracking
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),
  },
  (table) => [
    index("link_clicks_link_id_idx").on(table.linkId),
    index("link_clicks_timestamp_idx").on(table.timestamp),
    index("link_clicks_link_id_timestamp_idx").on(table.linkId, table.timestamp),
    index("link_clicks_country_idx").on(table.country),
    index("link_clicks_session_id_idx").on(table.sessionId),
  ]
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    linkId: uuid("link_id")
      .notNull()
      .references(() => shortLinks.id, { onDelete: "cascade" }),
    reportedBy: uuid("reported_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("reports_link_id_idx").on(table.linkId),
    index("reports_status_idx").on(table.status),
  ]
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ShortLink = typeof shortLinks.$inferSelect;
export type NewShortLink = typeof shortLinks.$inferInsert;
export type LinkClick = typeof linkClicks.$inferSelect;
export type NewLinkClick = typeof linkClicks.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type RateLimitEntry = typeof rateLimitEntries.$inferSelect;

// ─── RBAC Seed Data (para usar en migración) ─────────────────────────────────

export const PERMISSION_SEEDS: Permission[] = [
  { id: "links:create", description: "Crear links propios", resource: "links", action: "create", scope: "own" },
  { id: "links:read:own", description: "Ver links propios", resource: "links", action: "read", scope: "own" },
  { id: "links:read:all", description: "Ver todos los links", resource: "links", action: "read", scope: "all" },
  { id: "links:update:own", description: "Editar links propios", resource: "links", action: "update", scope: "own" },
  { id: "links:update:any", description: "Editar cualquier link", resource: "links", action: "update", scope: "any" },
  { id: "links:delete:own", description: "Eliminar links propios", resource: "links", action: "delete", scope: "own" },
  { id: "links:delete:any", description: "Eliminar cualquier link", resource: "links", action: "delete", scope: "any" },
  { id: "links:disable:any", description: "Deshabilitar cualquier link", resource: "links", action: "disable", scope: "any" },
  { id: "analytics:read:own", description: "Ver analytics propios", resource: "analytics", action: "read", scope: "own" },
  { id: "analytics:read:all", description: "Ver todos los analytics", resource: "analytics", action: "read", scope: "all" },
  { id: "reports:create", description: "Reportar links", resource: "reports", action: "create", scope: "any" },
  { id: "reports:read:all", description: "Ver todos los reportes", resource: "reports", action: "read", scope: "all" },
  { id: "reports:resolve", description: "Resolver reportes", resource: "reports", action: "resolve", scope: "all" },
  { id: "users:read:all", description: "Ver todos los usuarios", resource: "users", action: "read", scope: "all" },
];

export const ROLE_PERMISSION_SEEDS: { role: "USER" | "ADMIN"; permissionId: string }[] = [
  // USER
  { role: "USER", permissionId: "links:create" },
  { role: "USER", permissionId: "links:read:own" },
  { role: "USER", permissionId: "links:update:own" },
  { role: "USER", permissionId: "links:delete:own" },
  { role: "USER", permissionId: "analytics:read:own" },
  { role: "USER", permissionId: "reports:create" },
  // ADMIN — hereda todo + extras
  { role: "ADMIN", permissionId: "links:create" },
  { role: "ADMIN", permissionId: "links:read:own" },
  { role: "ADMIN", permissionId: "links:read:all" },
  { role: "ADMIN", permissionId: "links:update:own" },
  { role: "ADMIN", permissionId: "links:update:any" },
  { role: "ADMIN", permissionId: "links:delete:own" },
  { role: "ADMIN", permissionId: "links:delete:any" },
  { role: "ADMIN", permissionId: "links:disable:any" },
  { role: "ADMIN", permissionId: "analytics:read:own" },
  { role: "ADMIN", permissionId: "analytics:read:all" },
  { role: "ADMIN", permissionId: "reports:create" },
  { role: "ADMIN", permissionId: "reports:read:all" },
  { role: "ADMIN", permissionId: "reports:resolve" },
  { role: "ADMIN", permissionId: "users:read:all" },
];
