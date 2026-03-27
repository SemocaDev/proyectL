import { db } from "@/db";
import { linkClicks, shortLinks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { hashIP, cleanReferer, parseUserAgent } from "@/lib/analytics-utils";
import { WagaraPattern } from "@/components/wagara-pattern";
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
      <div className="flex min-h-screen items-center justify-center bg-shironeri">
        <div className="text-center space-y-2">
          <p className="text-2xl font-light text-sumi">429</p>
          <p className="text-sm text-ginnezumi">Too many requests. Try again later.</p>
        </div>
      </div>
    );
  }

  // Look up short code
  const [link] = await db
    .select()
    .from(shortLinks)
    .where(and(eq(shortLinks.shortCode, code), eq(shortLinks.status, "active")))
    .limit(1);

  if (!link) {
    notFound();
  }

  // Check click limit
  if (link.clickLimit !== null && link.clickCount >= link.clickLimit) {
    notFound();
  }

  // Track click (fire-and-forget, does not block response)
  void trackClick(link.id, headerStore);

  // --- Mode: redirect ---
  if (link.mode === "redirect" && link.targetUrl) {
    redirect(link.targetUrl);
  }

  // --- Mode: linkhub ---
  const data = (link.landingData as LandingData) ?? {};
  const accent = data.theme?.accentColor ?? "#B94047";

  return (
    <div className="relative min-h-screen bg-shironeri">
      <WagaraPattern pattern="seigaiha" opacity={0.025} />

      <div className="relative z-10 mx-auto max-w-md px-4 py-16">
        <div className="mb-10 text-center space-y-3">
          <div
            className="mx-auto h-px w-12"
            style={{ backgroundColor: accent }}
          />
          {data.title && (
            <h1 className="text-2xl font-light text-sumi">{data.title}</h1>
          )}
          {data.bio && (
            <p className="text-sm leading-relaxed text-ginnezumi">{data.bio}</p>
          )}
        </div>

        {data.links && data.links.length > 0 ? (
          <div className="space-y-3">
            {data.links.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border border-hai bg-white px-6 py-4 text-center text-sm font-medium text-sumi shadow-sm transition-all hover:shadow-md"
                style={{
                  borderLeftColor: accent,
                  borderLeftWidth: "3px",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-ginnezumi">
            No links configured yet.
          </p>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://l.devminds.online"
            className="text-xs text-ginnezumi/40 transition-colors hover:text-ginnezumi"
          >
            Powered by DevMinds Links
          </a>
        </div>
      </div>
    </div>
  );
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
