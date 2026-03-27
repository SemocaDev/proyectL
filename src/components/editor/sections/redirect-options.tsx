"use client";

import { useTranslations } from "next-intl";

interface RedirectOptionsProps {
  delay: number;
  onDelayChange: (v: number) => void;
}

export function RedirectOptions({ delay, onDelayChange }: RedirectOptionsProps) {
  const t = useTranslations("editor");

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("redirectOptions")}
      </h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-ginnezumi">{t("countdownDelay")}</label>
          <span className="text-xs font-medium text-sumi">
            {delay === 0 ? t("instant") : `${delay}s`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={delay}
          onChange={(e) => onDelayChange(Number(e.target.value))}
          className="w-full accent-beni"
        />
        <div className="flex justify-between text-[10px] text-ginnezumi/50">
          <span>{t("instant")}</span>
          <span>10s</span>
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
