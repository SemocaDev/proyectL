"use client";

import { useTranslations } from "next-intl";

interface RedirectOptionsProps {
  delay: number;
  onDelayChange: (v: number) => void;
}

const DELAY_OPTIONS = [0, 3, 5, 7, 10] as const;

export function RedirectOptions({ delay, onDelayChange }: RedirectOptionsProps) {
  const t = useTranslations("editor");

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("redirectOptions")}
      </h3>

      <div className="space-y-2">
        <label className="text-xs text-ginnezumi">{t("countdownDelay")}</label>
        <div className="flex gap-2">
          {DELAY_OPTIONS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onDelayChange(val)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                delay === val
                  ? "border-beni bg-beni/5 text-beni ring-1 ring-beni/40"
                  : "border-hai bg-white text-ginnezumi hover:border-ginnezumi/40 hover:text-sumi"
              }`}
            >
              {val === 0 ? t("instant") : `${val}s`}
            </button>
          ))}
        </div>
      </div>

      {delay > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-beni/20 bg-beni/5 px-3 py-2.5">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-beni/60" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-ginnezumi">{t("countdownHint")}</p>
        </div>
      )}
    </section>
  );
}
