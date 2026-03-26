import { useTranslations } from "next-intl";

export default function ConfirmationPage() {
  const t = useTranslations("create");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-sumi">{t("title")}</h1>
        <p className="text-ginnezumi">{t("claimBanner")}</p>
      </div>
    </main>
  );
}
