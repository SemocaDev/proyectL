import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-sumi sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-lg text-ginnezumi">{t("subtitle")}</p>
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder={t("inputPlaceholder")}
            className="flex-1 rounded-lg border border-hai bg-white px-4 py-3 text-sumi placeholder:text-ginnezumi/50 focus:outline-none focus:ring-2 focus:ring-beni"
          />
          <button className="rounded-lg bg-beni px-6 py-3 font-medium text-white transition-colors hover:bg-beni/90">
            {t("createButton")}
          </button>
        </div>
      </div>
    </main>
  );
}
