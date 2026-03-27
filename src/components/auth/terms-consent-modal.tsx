"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface TermsConsentModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsConsentModal({ open, onClose }: TermsConsentModalProps) {
  const t = useTranslations("legal");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleContinue() {
    if (!accepted) return;
    setLoading(true);
    // termsAcceptedAt se guarda en el callback signIn de auth.ts al crear el usuario,
    // o vía la server action si el usuario ya existía. Lo pasamos como callbackUrl
    // con un param para que el signIn callback lo detecte.
    await signIn("google", { callbackUrl: "/?termsAccepted=1" });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sumi/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-2xl bg-shironeri shadow-xl ring-1 ring-hai">
        {/* Accent top */}
        <div className="h-1 rounded-t-2xl bg-beni" />

        <div className="space-y-5 px-6 py-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="h-px w-8 bg-beni" />
            <h2 id="consent-title" className="text-lg font-light text-sumi">
              {t("consentTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-ginnezumi">
              {t("consentBody")}
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-beni"
            />
            <span className="text-sm leading-relaxed text-ginnezumi">
              {t.rich("consentCheck", {
                terms: (chunks) => (
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    className="text-beni underline underline-offset-2 hover:text-shu"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href="/legal/privacy"
                    target="_blank"
                    className="text-beni underline underline-offset-2 hover:text-shu"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={!accepted || loading}
              onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-sumi px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-sumi/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {/* Google icon */}
              {!loading && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {loading ? "..." : t("consentCta")}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl px-4 py-2 text-sm text-ginnezumi/60 transition-colors hover:text-ginnezumi"
            >
              {t("consentCancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
