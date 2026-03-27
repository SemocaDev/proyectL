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
        <p className="rounded-lg border border-hai/50 bg-shironeri px-3 py-2 text-xs text-ginnezumi">
          {t("countdownHint")}
        </p>
      )}
    </section>
  );
}
