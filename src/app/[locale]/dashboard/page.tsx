import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-sumi">{t("title")}</h1>
        <p className="mt-2 text-ginnezumi">{t("noLinks")}</p>
      </div>
    </main>
  );
}
