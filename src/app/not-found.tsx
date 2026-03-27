import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { WagaraPattern } from "@/components/wagara-pattern";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        <WagaraPattern pattern="ryusuimon" opacity={0.02} />

        <div className="relative z-10 text-center space-y-6">
          <p className="text-7xl font-light text-beni/20 sm:text-9xl">404</p>
          <div className="space-y-2">
            <h1 className="text-2xl font-light text-sumi sm:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-ginnezumi max-w-sm mx-auto">
              {t("description")}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block rounded-lg bg-beni px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-beni/90"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
