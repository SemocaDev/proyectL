import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("legal");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="prose mx-auto max-w-3xl">
        <h1>{t("terms")}</h1>
      </div>
    </main>
  );
}
