import { z } from "zod/v4";

// ─── Sub-schemas para LinkHub ────────────────────────────────────────────────

export const buttonStyleSchema = z.object({
  shape: z.enum(["rounded", "sharp", "pill"]),
  variant: z.enum(["filled", "outline"]),
});

export const linkhubLinkItemSchema = z.object({
  label: z.string().max(50),
  url: z.url(),
  icon: z.string().max(30).optional(),
});

export const themeSchema = z.object({
  accentColor: z.string().optional(),
  bgTheme: z.enum(["light", "cream", "dark"]).optional(),
  buttonStyle: buttonStyleSchema.optional(),
});

export const landingDataSchema = z.object({
  title: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  links: z.array(linkhubLinkItemSchema).max(20).optional(),
  theme: themeSchema.optional(),
});

// ─── Link CRUD schemas ──────────────────────────────────────────────────────

export const createLinkSchema = z.object({
  targetUrl: z.url().max(2048),
  mode: z.enum(["redirect", "linkhub"]),
  title: z.string().max(100).optional(),
  redirectDelay: z.number().int().min(0).max(10).optional(),
  landingData: landingDataSchema.optional(),
});

export const updateLinkSchema = z.object({
  targetUrl: z.url().max(2048).optional(),
  mode: z.enum(["redirect", "linkhub"]).optional(),
  title: z.string().max(100).optional(),
  redirectDelay: z.number().int().min(0).max(10).nullable().optional(),
  landingData: landingDataSchema.optional(),
});

export const reportLinkSchema = z.object({
  linkId: z.uuid(),
  reason: z.string().min(10).max(1000),
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ReportLinkInput = z.infer<typeof reportLinkSchema>;
export type LandingData = z.infer<typeof landingDataSchema>;
export type ButtonStyle = z.infer<typeof buttonStyleSchema>;
export type LinkhubLinkItem = z.infer<typeof linkhubLinkItemSchema>;
export type Theme = z.infer<typeof themeSchema>;
