import { useTranslations } from "next-intl";

export default function AdminReportsPage() {
  const t = useTranslations("admin");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-sumi">{t("reports")}</h1>
      </div>
    </main>
  );
}
