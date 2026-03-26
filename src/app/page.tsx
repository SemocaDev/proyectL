import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WagaraPattern } from "@/components/wagara-pattern";
import { UrlInput } from "@/components/home/url-input";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      {/* Hero */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        {/* Patrón wagara — textura de fondo casi imperceptible */}
        <WagaraPattern pattern="seigaiha" opacity={0.025} />

        <div className="relative z-10 w-full max-w-2xl space-y-10 text-center">
          {/* Logo mark — línea roja fina */}
          <div className="mx-auto h-px w-16 bg-beni" />

          <div className="space-y-4">
            <h1 className="font-sans text-4xl font-light tracking-tight text-sumi sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-base text-ginnezumi">{t("subtitle")}</p>
          </div>

          <UrlInput placeholder={t("inputPlaceholder")} cta={t("createButton")} />

          {/* Features discretas */}
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-ginnezumi/70">
            {[t("feature1"), t("feature2"), t("feature3")].map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-beni" />
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
