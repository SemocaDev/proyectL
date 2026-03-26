import { z } from "zod/v4";

export const createLinkSchema = z.object({
  targetUrl: z.url().max(2048),
  mode: z.enum(["redirect", "linkhub"]),
  title: z.string().max(100).optional(),
});

export const updateLinkSchema = z.object({
  targetUrl: z.url().max(2048).optional(),
  mode: z.enum(["redirect", "linkhub"]).optional(),
  title: z.string().max(100).optional(),
  landingData: z
    .object({
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
      theme: z
        .object({
          accentColor: z.string().optional(),
          bgColor: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
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
  theme: z
    .object({
      accentColor: z.string().optional(),
      bgColor: z.string().optional(),
    })
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ReportLinkInput = z.infer<typeof reportLinkSchema>;
export type LandingData = z.infer<typeof landingDataSchema>;
