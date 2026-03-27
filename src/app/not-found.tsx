import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { WagaraPattern } from "@/components/patterns";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        {/* Patrón uroko — escamas de protección */}
        <WagaraPattern pattern="uroko" color="#B94047" opacity={0.06} />

        {/* Gradiente radial para difuminar */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 20%, #F9F7F2 85%)",
          }}
        />

        <div className="relative z-10 text-center space-y-8">
          {/* 404 grande con opacidad beni */}
          <div className="relative">
            <p className="select-none text-[8rem] font-light leading-none text-beni/15 sm:text-[12rem] lg:text-[16rem]">
              404
            </p>
            {/* Línea decorativa superpuesta */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-beni/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-beni" />
                  <span className="h-px w-8 bg-beni/40" />
                </div>
                <h1 className="text-xl font-light text-sumi sm:text-2xl">
                  {t("title")}
                </h1>
                <p className="text-sm text-ginnezumi max-w-xs mx-auto">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-beni px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-beni/90 hover:shadow-md active:scale-[0.98]"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
