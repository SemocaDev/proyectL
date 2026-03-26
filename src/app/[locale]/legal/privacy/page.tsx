import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="prose mx-auto max-w-3xl">
        <h1>{t("privacy")}</h1>
      </div>
    </main>
  );
}
