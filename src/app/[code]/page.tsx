import { db } from "@/db";
import { linkClicks, shortLinks, users } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { hashIP, cleanReferer, parseUserAgent } from "@/lib/analytics-utils";
import { CountdownPage } from "@/components/redirect/countdown-page";
import { LinkhubPreview } from "@/components/editor/linkhub-preview";
import type { LandingData } from "@/lib/schemas";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function ShortCodePage({ params }: Props) {
  const { code } = await params;
  const headerStore = await headers();

  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit
  const { success } = await checkRateLimit(
    `redirect:${ip}:${code}`,
    LIMITS.REDIRECT.limit,
    LIMITS.REDIRECT.windowMs
  );

  if (!success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-shironeri px-4">
        <div className="text-center space-y-4">
          <p className="text-6xl font-light text-beni/20 sm:text-8xl">429</p>
          <div className="space-y-1">
            <p className="text-xl font-light text-sumi">Too many requests</p>
            <p className="text-sm text-ginnezumi">Please wait a moment and try again.</p>
          </div>
          <a
            href="/"
            className="inline-block rounded-lg border border-hai px-5 py-2 text-sm text-ginnezumi transition-colors hover:border-sumi hover:text-sumi"
          >
            Go home
          </a>
        </div>
      </div>
    );
  }

  // Look up short code + creator name
  const [row] = await db
    .select({
      link: shortLinks,
      creatorName: users.name,
    })
    .from(shortLinks)
    .leftJoin(users, eq(shortLinks.ownerId, users.id))
    .where(and(eq(shortLinks.shortCode, code), eq(shortLinks.status, "active")))
    .limit(1);

  if (!row) {
    notFound();
  }

  const link = row.link;
  const creatorName = row.creatorName;

  // Check click limit
  if (link.clickLimit !== null && link.clickCount >= link.clickLimit) {
    notFound();
  }

  // Track click (fire-and-forget, does not block response)
  void trackClick(link.id, headerStore);

  // --- Mode: redirect ---
  if (link.mode === "redirect" && link.targetUrl) {
    // Countdown page if delay is configured
    if (link.redirectDelay && link.redirectDelay > 0) {
      return (
        <CountdownPage
          title={link.title}
          creatorName={creatorName}
          targetUrl={link.targetUrl}
          delay={link.redirectDelay}
        />
      );
    }
    redirect(link.targetUrl);
  }

  // --- Mode: linkhub ---
  const rawData = (link.landingData as LandingData) ?? {};
  const data: LandingData = {
    ...rawData,
    title: rawData.title || link.title || undefined,
  };

  return <LinkhubPreview data={data} embedded />;
}

async function trackClick(
  linkId: string,
  headerStore: Awaited<ReturnType<typeof headers>>
): Promise<void> {
  try {
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ua = headerStore.get("user-agent") ?? "";
    const rawReferer = headerStore.get("referer");

    const ipHash = await hashIP(ip);
    const sessionId = await hashIP(
      `${ip}:${ua}:${new Date().toDateString()}`
    );
    const referer = rawReferer ? cleanReferer(rawReferer) : null;

    const country = headerStore.get("x-vercel-ip-country") ?? null;
    const city = headerStore.get("x-vercel-ip-city") ?? null;
    const region = headerStore.get("x-vercel-ip-country-region") ?? null;

    const acceptLanguage = headerStore.get("accept-language");
    const language =
      acceptLanguage?.split(",")[0]?.trim().slice(0, 10) ?? null;

    const { deviceType, browserName, osName, isBot } = parseUserAgent(ua);

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
      screenWidth: null,
      screenHeight: null,
      timezone: null,
      connectionType: null,
      linkButtonIndex: null,
      duration: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
    });

    await db
      .update(shortLinks)
      .set({ clickCount: sql`${shortLinks.clickCount} + 1` })
      .where(eq(shortLinks.id, linkId));
  } catch (error) {
    console.error("[analytics] Failed to track click:", error);
  }
}
