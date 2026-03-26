import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { WagaraPattern } from "@/components/wagara-pattern";
import type { LandingData } from "@/lib/schemas";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function HubPage({ params }: Props) {
  const { code } = await params;

  const [link] = await db
    .select()
    .from(shortLinks)
    .where(and(eq(shortLinks.shortCode, code), eq(shortLinks.mode, "linkhub")))
    .limit(1);

  if (!link || link.status !== "active") {
    notFound();
  }

  const data = (link.landingData as LandingData) ?? {};
  const accent = data.theme?.accentColor ?? "#B94047";

  return (
    <div className="relative min-h-screen bg-shironeri">
      <WagaraPattern pattern="seigaiha" opacity={0.025} />

      <div className="relative z-10 mx-auto max-w-md px-4 py-16">
        {/* Perfil */}
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

        {/* Botones de links */}
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
            No hay links configurados aún.
          </p>
        )}

        {/* Footer del hub */}
        <div className="mt-12 text-center">
          <a
            href="https://l.devminds.online"
            className="text-xs text-ginnezumi/40 transition-colors hover:text-ginnezumi"
          >
            Creado con DevMinds Links
          </a>
        </div>
      </div>
    </div>
  );
}
