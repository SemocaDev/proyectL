"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { shortLinks, linkClicks } from "@/db/schema";
import { createLinkSchema, updateLinkSchema } from "@/lib/schemas";
import { generateUniqueShortCode } from "@/lib/short-code";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { USER_LINK_LIMIT } from "@/lib/config";
import { eq, count, sql, gte, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { verifyLinkOwnership } from "@/lib/security";

export async function createLink(input: {
  targetUrl: string;
  mode: "redirect" | "linkhub";
  title?: string;
  redirectDelay?: number;
  landingData?: Record<string, unknown>;
}) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    // Extract first meaningful error for user feedback
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path?.join(".") ?? "";
    const msg = firstIssue?.message ?? "Invalid input";
    return { error: path ? `${path}: ${msg}` : msg };
  }

  // Validate targetUrl as URL for redirect mode
  if (parsed.data.mode === "redirect") {
    if (!parsed.data.targetUrl.trim()) return { error: "URL is required" };
    try {
      const u = new URL(parsed.data.targetUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { error: "URL must start with http:// or https://" };
      }
    } catch {
      return { error: "Invalid URL format" };
    }
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success } = await checkRateLimit(
    `create:${session.user.id}`,
    LIMITS.CREATE_AUTH.limit,
    LIMITS.CREATE_AUTH.windowMs
  );
  if (!success) return { error: "Rate limit exceeded. Try again in a minute." };

  const [{ total }] = await db
    .select({ total: count() })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id));

  if (total >= USER_LINK_LIMIT) {
    return { error: `Link limit reached (${USER_LINK_LIMIT})` };
  }

  const shortCode = await generateUniqueShortCode();

  const [link] = await db
    .insert(shortLinks)
    .values({
      shortCode,
      ownerId: session.user.id,
      mode: parsed.data.mode,
      targetUrl: parsed.data.targetUrl,
      title: parsed.data.title ?? null,
      redirectDelay: parsed.data.redirectDelay ?? null,
      landingData: parsed.data.landingData ?? null,
    })
    .returning();

  return {
    shortCode: link.shortCode,
    shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.shortCode}`,
    id: link.id,
  };
}

export async function updateLink(
  linkId: string,
  data: {
    targetUrl?: string;
    mode?: "redirect" | "linkhub";
    title?: string;
    redirectDelay?: number | null;
    landingData?: Record<string, unknown>;
  }
) {
  await verifyLinkOwnership(linkId);

  const parsed = updateLinkSchema.safeParse(data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const path = firstIssue?.path?.join(".") ?? "";
    const msg = firstIssue?.message ?? "Invalid input";
    return { error: path ? `${path}: ${msg}` : msg };
  }

  // Validate targetUrl if provided
  if (parsed.data.targetUrl) {
    try {
      const u = new URL(parsed.data.targetUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { error: "URL must start with http:// or https://" };
      }
    } catch {
      return { error: "Invalid URL format" };
    }
  }

  await db
    .update(shortLinks)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}

export async function deleteLink(linkId: string) {
  await verifyLinkOwnership(linkId);
  await db.delete(shortLinks).where(eq(shortLinks.id, linkId));
  return { success: true };
}

export async function getUserLinks() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const links = await db
    .select({
      id: shortLinks.id,
      shortCode: shortLinks.shortCode,
      mode: shortLinks.mode,
      targetUrl: shortLinks.targetUrl,
      title: shortLinks.title,
      status: shortLinks.status,
      clickCount: shortLinks.clickCount,
      redirectDelay: shortLinks.redirectDelay,
      landingData: shortLinks.landingData,
      createdAt: shortLinks.createdAt,
    })
    .from(shortLinks)
    .where(eq(shortLinks.ownerId, session.user.id))
    .orderBy(sql`${shortLinks.createdAt} DESC`);

  return { links };
}

export async function getLinkStats(linkId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  // Allow admin to view any link stats, regular users only their own
  if (session.user.role !== "ADMIN") {
    await verifyLinkOwnership(linkId);
  }

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // All queries in parallel
  const [
    linkRow,
    clicksByDay,
    byCountry,
    byDevice,
    byBrowser,
    byOs,
    byReferer,
    totalUnique,
    totalBots,
  ] = await Promise.all([
    // Link metadata
    db
      .select({
        id: shortLinks.id,
        shortCode: shortLinks.shortCode,
        title: shortLinks.title,
        mode: shortLinks.mode,
        targetUrl: shortLinks.targetUrl,
        clickCount: shortLinks.clickCount,
        status: shortLinks.status,
        createdAt: shortLinks.createdAt,
      })
      .from(shortLinks)
      .where(eq(shortLinks.id, linkId))
      .limit(1),

    // Clicks per day (last 30 days)
    db
      .select({
        date: sql<string>`date_trunc('day', ${linkClicks.timestamp})::date::text`,
        clicks: count(),
      })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(sql`date_trunc('day', ${linkClicks.timestamp})`)
      .orderBy(sql`date_trunc('day', ${linkClicks.timestamp})`),

    // Top countries
    db
      .select({ country: linkClicks.country, clicks: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(linkClicks.country)
      .orderBy(desc(count()))
      .limit(8),

    // Device types
    db
      .select({ device: linkClicks.deviceType, clicks: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(linkClicks.deviceType)
      .orderBy(desc(count())),

    // Browsers
    db
      .select({ browser: linkClicks.browserName, clicks: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(linkClicks.browserName)
      .orderBy(desc(count()))
      .limit(6),

    // OS
    db
      .select({ os: linkClicks.osName, clicks: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(linkClicks.osName)
      .orderBy(desc(count()))
      .limit(6),

    // Top referers
    db
      .select({ referer: linkClicks.referer, clicks: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d)))
      .groupBy(linkClicks.referer)
      .orderBy(desc(count()))
      .limit(8),

    // Unique sessions (approximate unique visitors)
    db
      .select({ unique: sql<number>`count(distinct ${linkClicks.sessionId})` })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), gte(linkClicks.timestamp, since30d))),

    // Bot clicks
    db
      .select({ bots: count() })
      .from(linkClicks)
      .where(and(eq(linkClicks.linkId, linkId), eq(linkClicks.isBot, true), gte(linkClicks.timestamp, since30d))),
  ]);

  if (!linkRow[0]) return { error: "Not found" };

  // Fill missing days in the 30d range with 0
  const dayMap = new Map(clicksByDay.map((r) => [r.date, Number(r.clicks)]));
  const filledDays: { date: string; clicks: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    filledDays.push({ date: key, clicks: dayMap.get(key) ?? 0 });
  }

  return {
    link: linkRow[0],
    clicksByDay: filledDays,
    byCountry: byCountry.map((r) => ({ name: r.country ?? "Unknown", value: Number(r.clicks) })),
    byDevice: byDevice.map((r) => ({ name: r.device ?? "Unknown", value: Number(r.clicks) })),
    byBrowser: byBrowser.map((r) => ({ name: r.browser ?? "Unknown", value: Number(r.clicks) })),
    byOs: byOs.map((r) => ({ name: r.os ?? "Unknown", value: Number(r.clicks) })),
    byReferer: byReferer.map((r) => ({ name: r.referer ?? "Direct", value: Number(r.clicks) })),
    uniqueVisitors: Number(totalUnique[0]?.unique ?? 0),
    botClicks: Number(totalBots[0]?.bots ?? 0),
  };
}

export async function getLinkById(linkId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await verifyLinkOwnership(linkId);

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.id, linkId))
    .limit(1);

  if (!link) return { error: "Not found" };

  return { link };
}
