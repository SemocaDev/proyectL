import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  sessions,
  shortLinks,
  linkClicks,
  reports,
  rolePermissions,
  permissions,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  shortLinks: many(shortLinks),
  reports: many(reports),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const shortLinksRelations = relations(shortLinks, ({ one, many }) => ({
  owner: one(users, { fields: [shortLinks.ownerId], references: [users.id] }),
  clicks: many(linkClicks),
  reports: many(reports),
}));

export const linkClicksRelations = relations(linkClicks, ({ one }) => ({
  link: one(shortLinks, {
    fields: [linkClicks.linkId],
    references: [shortLinks.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  link: one(shortLinks, {
    fields: [reports.linkId],
    references: [shortLinks.id],
  }),
  reporter: one(users, {
    fields: [reports.reportedBy],
    references: [users.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
