import { z } from "zod/v4";

export const createLinkSchema = z.object({
  targetUrl: z.url().max(2048),
  mode: z.enum(["redirect", "linkhub"]),
});

export const claimLinkSchema = z.object({
  linkId: z.uuid(),
  shortCode: z.string().min(5).max(12),
});

export const reportLinkSchema = z.object({
  linkId: z.uuid(),
  reason: z.string().min(10).max(1000),
});

export const landingDataSchema = z.object({
  title: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  links: z
    .array(
      z.object({
        label: z.string().max(50),
        url: z.url(),
      })
    )
    .max(20)
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type ClaimLinkInput = z.infer<typeof claimLinkSchema>;
export type ReportLinkInput = z.infer<typeof reportLinkSchema>;
export type LandingData = z.infer<typeof landingDataSchema>;
