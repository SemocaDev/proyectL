import { db } from "@/db";
import { linkClicks } from "@/db/schema";
import type { NextRequest } from "next/server";

export async function trackClick(
  linkId: string,
  request: NextRequest
): Promise<void> {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = await hashIP(ip);
    const ua = request.headers.get("user-agent") ?? "";
    const rawReferer = request.headers.get("referer");
    const referer = rawReferer ? cleanReferer(rawReferer) : null;

    const country = request.headers.get("x-vercel-ip-country") ?? null;
    const city = request.headers.get("x-vercel-ip-city") ?? null;
    const region = request.headers.get("x-vercel-ip-country-region") ?? null;

    const { deviceType, browserName, osName } = parseUserAgent(ua);

    await db.insert(linkClicks).values({
      linkId,
      ipHash,
      country,
      city,
      region,
      referer,
      userAgent: ua.slice(0, 500),
      deviceType,
      browserName,
      osName,
    });
  } catch (error) {
    console.error("[analytics] Failed to track click:", error);
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

function cleanReferer(referer: string): string {
  try {
    const url = new URL(referer);
    return url.hostname;
  } catch {
    return referer.slice(0, 100);
  }
}

function parseUserAgent(ua: string) {
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

  return { deviceType, browserName, osName };
}
