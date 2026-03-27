import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WagaraPattern } from "@/components/patterns";
import { UrlInput } from "@/components/home/url-input";
import { getTranslations } from "next-intl/server";
import { colors } from "@/lib/css-vars";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      {/* Hero */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
        {/* Patrón seigaiha — olas de fondo más visibles */}
        <WagaraPattern pattern="seigaiha" color={colors.beni} opacity={0.10} />

        {/* Gradiente radial encima del patrón para difuminar bordes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, ${colors.shironeri} 100%)`,
          }}
        />

        <div className="relative z-10 w-full max-w-2xl space-y-10 text-center">
          {/* Divisor decorativo beni */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-beni/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-beni" />
            <span className="h-px w-8 bg-beni/40" />
          </div>

          <div className="space-y-4">
            <h1 className="font-sans text-4xl font-light tracking-tight text-sumi sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="text-base text-ginnezumi sm:text-lg">{t("subtitle")}</p>
          </div>

          <UrlInput placeholder={t("inputPlaceholder")} cta={t("createButton")} />

          {/* Features */}
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-ginnezumi/60">
            {[t("feature1"), t("feature2"), t("feature3")].map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-beni/60" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
