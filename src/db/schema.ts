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

// ─── Application Tables ──────────────────────────────────────────────────────

export const shortLinks = pgTable(
  "short_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shortCode: varchar("short_code", { length: 12 }).unique().notNull(),
    ownerId: uuid("owner_id").references(() => users.id, {
      onDelete: "set null",
    }),
    mode: linkModeEnum("mode").default("redirect").notNull(),
    targetUrl: text("target_url"),
    landingData: jsonb("landing_data"),
    isClaimed: boolean("is_claimed").default(false).notNull(),
    status: linkStatusEnum("status").default("active").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("short_links_short_code_idx").on(table.shortCode),
    index("short_links_owner_id_idx").on(table.ownerId),
    index("short_links_status_idx").on(table.status),
    index("short_links_expires_at_idx").on(table.expiresAt),
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
    ipHash: varchar("ip_hash", { length: 64 }),
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 100 }),
    region: varchar("region", { length: 100 }),
    referer: text("referer"),
    userAgent: text("user_agent"),
    deviceType: varchar("device_type", { length: 20 }),
    browserName: varchar("browser_name", { length: 50 }),
    osName: varchar("os_name", { length: 50 }),
  },
  (table) => [
    index("link_clicks_link_id_idx").on(table.linkId),
    index("link_clicks_timestamp_idx").on(table.timestamp),
    index("link_clicks_link_id_timestamp_idx").on(
      table.linkId,
      table.timestamp
    ),
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
    createdAt: timestamp("created_at", { mode: "date" })
      .defaultNow()
      .notNull(),
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
