/**
 * Shared analytics utilities — used by both the route handler and
 * the [code] server component for click tracking.
 */

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export function cleanReferer(referer: string): string {
  try {
    const url = new URL(referer);
    return url.hostname;
  } catch {
    return referer.slice(0, 100);
  }
}

const BOT_REGEX =
  /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver/i;

export function parseUserAgent(ua: string) {
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
