import { db } from "@/db";
import { linkClicks, shortLinks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { hashIP, cleanReferer, parseUserAgent } from "./analytics-utils";

interface ClickMetadata {
  screenWidth?: number;
  screenHeight?: number;
  timezone?: string;
  connectionType?: string;
  linkButtonIndex?: number;
  duration?: number;
}

export async function trackClick(
  linkId: string,
  request: NextRequest,
  extra?: ClickMetadata
): Promise<void> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ipHash = await hashIP(ip);
    const sessionId = await hashIP(
      `${ip}:${request.headers.get("user-agent") ?? ""}:${new Date().toDateString()}`
    );

    const ua = request.headers.get("user-agent") ?? "";
    const rawReferer = request.headers.get("referer");
    const referer = rawReferer ? cleanReferer(rawReferer) : null;

    const country = request.headers.get("x-vercel-ip-country") ?? null;
    const city = request.headers.get("x-vercel-ip-city") ?? null;
    const region = request.headers.get("x-vercel-ip-country-region") ?? null;

    const acceptLanguage = request.headers.get("accept-language");
    const language =
      acceptLanguage?.split(",")[0]?.trim().slice(0, 10) ?? null;

    const { deviceType, browserName, osName, isBot } = parseUserAgent(ua);

    const requestUrl = new URL(request.url);
    const utmSource = requestUrl.searchParams.get("utm_source");
    const utmMedium = requestUrl.searchParams.get("utm_medium");
    const utmCampaign = requestUrl.searchParams.get("utm_campaign");

    await db.insert(linkClicks).values({
      linkId,
      ipHash,
      sessionId,
      isBot,
      country,
      city,
      region,
      referer,
      userAgent: ua.slice(0, 500),
      language,
      deviceType,
      browserName,
      osName,
      screenWidth: extra?.screenWidth ?? null,
      screenHeight: extra?.screenHeight ?? null,
      timezone: extra?.timezone ?? null,
      connectionType: extra?.connectionType ?? null,
      linkButtonIndex: extra?.linkButtonIndex ?? null,
      duration: extra?.duration ?? null,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    await db
      .update(shortLinks)
      .set({ clickCount: sql`${shortLinks.clickCount} + 1` })
      .where(eq(shortLinks.id, linkId));
  } catch (error) {
    console.error("[analytics] Failed to track click:", error);
  }
}
