"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { acceptTerms } from "@/actions/user-actions";

export function TermsConsentModal() {
  const t = useTranslations("legal");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    if (!accepted) return;
    setLoading(true);
    const res = await acceptTerms();
    if (res.ok) {
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="absolute inset-0 bg-sumi/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm rounded-2xl bg-shironeri shadow-xl ring-1 ring-hai">
        <div className="h-1 rounded-t-2xl bg-beni" />

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-1">
            <div className="h-px w-8 bg-beni" />
            <h2 id="consent-title" className="text-lg font-light text-sumi">
              {t("consentTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-ginnezumi">
              {t("consentBody")}
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ginnezumi">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-beni"
            />
            <span>
              {t("consentCheckPre") && <>{t("consentCheckPre")}{" "}</>}
              <Link href="/legal/terms" target="_blank" className="text-beni underline underline-offset-2 hover:text-shu">
                {t("terms")}
              </Link>
              {" "}{t("consentCheckMid")}{" "}
              <Link href="/legal/privacy" target="_blank" className="text-beni underline underline-offset-2 hover:text-shu">
                {t("privacy")}
              </Link>
              {t("consentCheckSuffix")}
            </span>
          </label>

          <button
            type="button"
            disabled={!accepted || loading}
            onClick={handleAccept}
            className="flex w-full items-center justify-center rounded-xl bg-sumi px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-sumi/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "..." : t("consentCta")}
          </button>
        </div>
      </div>
    </div>
  );
}
