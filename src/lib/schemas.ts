import { z } from "zod/v4";

// ─── BgPattern (local union, no importar desde wagara-pattern para evitar dep "use client") ──
export const BG_PATTERN_VALUES = [
  "none",
  "seigaiha",
  "asanoha",
  "shippo",
  "ichimatsu",
  "ryusuimon",
  "tokusa",
  "uroko",
  "kikko",
  "karakusa",
] as const;
export type BgPattern = (typeof BG_PATTERN_VALUES)[number];

// ─── Sub-schemas para LinkHub ────────────────────────────────────────────────

export const buttonStyleSchema = z.object({
  shape: z.enum(["rounded", "sharp", "pill"]),
  variant: z.enum(["filled", "outline"]),
});

export const linkhubLinkItemSchema = z.object({
  label: z.string().max(50),
  url: z.url(),
  icon: z.string().max(30).optional(),
  highlighted: z.boolean().optional(),
});

export const themeSchema = z.object({
  accentColor: z.string().optional(),
  bgTheme: z.enum(["light", "cream", "dark"]).optional(),
  bgColor: z.string().optional(),        // color libre de fondo (hex), toma prioridad sobre bgTheme
  buttonStyle: buttonStyleSchema.optional(),
  buttonBorderColor: z.string().optional(), // color de borde de botones
  buttonBgColor: z.string().optional(),     // color de fondo de botones
  buttonTextColor: z.string().optional(),   // color de texto de botones
  bgPattern: z.enum(BG_PATTERN_VALUES).optional(),
  patternOpacity: z.number().min(0.02).max(0.20).optional(),
  patternAnimated: z.boolean().optional(),
  cardColor: z.string().optional(), // hex color for the content card (null = no card)
});

export const landingDataSchema = z.object({
  title: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().max(10).optional(),
  links: z.array(linkhubLinkItemSchema).max(20).optional(),
  theme: themeSchema.optional(),
});

// ─── Link CRUD schemas ──────────────────────────────────────────────────────

export const createLinkSchema = z.object({
  targetUrl: z.string().max(2048),   // validated as URL in server action for redirect mode
  mode: z.enum(["redirect", "linkhub"]),
  title: z.string().max(100).optional(),
  redirectDelay: z.number().int().min(0).max(10).optional(),
  landingData: landingDataSchema.optional(),
});

export const updateLinkSchema = z.object({
  targetUrl: z.string().max(2048).optional(),
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
