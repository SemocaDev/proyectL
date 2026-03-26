import { db } from "@/db";
import { linkClicks, shortLinks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";

interface ClickMetadata {
  /** Solo disponible desde LinkHub via JS post-carga */
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
    const sessionId = await hashIP(`${ip}:${request.headers.get("user-agent") ?? ""}:${new Date().toDateString()}`);

    const ua = request.headers.get("user-agent") ?? "";
    const rawReferer = request.headers.get("referer");
    const referer = rawReferer ? cleanReferer(rawReferer) : null;

    // GeoIP via Vercel headers
    const country = request.headers.get("x-vercel-ip-country") ?? null;
    const city = request.headers.get("x-vercel-ip-city") ?? null;
    const region = request.headers.get("x-vercel-ip-country-region") ?? null;

    // Accept-Language → primer locale (ej. "es-CO")
    const acceptLanguage = request.headers.get("accept-language");
    const language = acceptLanguage?.split(",")[0]?.trim().slice(0, 10) ?? null;

    const { deviceType, browserName, osName, isBot } = parseUserAgent(ua);

    // Extraer UTMs de la URL actual o del referer
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

    // Incrementar contador desnormalizado en short_links
    await db
      .update(shortLinks)
      .set({ clickCount: sql`${shortLinks.clickCount} + 1` })
      .where(eq(shortLinks.id, linkId));
  } catch (error) {
    console.error("[analytics] Failed to track click:", error);
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function cleanReferer(referer: string): string {
  try {
    const url = new URL(referer);
    return url.hostname;
  } catch {
    return referer.slice(0, 100);
  }
}

const BOT_REGEX =
  /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver/i;

function parseUserAgent(ua: string) {
  const isBot = BOT_REGEX.test(ua);

  const deviceType = /Mobile|Android|iPhone/i.test(ua)
    ? "mobile"
    : /Tablet|iPad/i.test(ua)
      ? "tablet"
      : "desktop";

  let browserName = "unknown";
  if (/Edg\//i.test(ua)) browserName = "Edge";
  else if (/Chrome\//i.test(ua)) browserName = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browserName = "Safari";
  else if (/Firefox\//i.test(ua)) browserName = "Firefox";
  else if (/Opera|OPR\//i.test(ua)) browserName = "Opera";

  let osName = "unknown";
  if (/Windows/i.test(ua)) osName = "Windows";
  else if (/Mac OS/i.test(ua)) osName = "macOS";
  else if (/Linux/i.test(ua)) osName = "Linux";
  else if (/Android/i.test(ua)) osName = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) osName = "iOS";

  return { deviceType, browserName, osName, isBot };
}
