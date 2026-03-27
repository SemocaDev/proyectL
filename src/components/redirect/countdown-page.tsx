"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { WagaraPattern } from "@/components/patterns";

interface CountdownPageProps {
  title: string | null;
  creatorName: string | null;
  targetUrl: string;
  delay: number;
}

export function CountdownPage({
  title,
  creatorName,
  targetUrl,
  delay,
}: CountdownPageProps) {
  const t = useTranslations("countdown");
  const [remaining, setRemaining] = useState(delay);
  const [redirecting, setRedirecting] = useState(false);

  const doRedirect = useCallback(() => {
    setRedirecting(true);
    window.location.href = targetUrl;
  }, [targetUrl]);

  useEffect(() => {
    if (remaining <= 0) {
      doRedirect();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, doRedirect]);

  // SVG circle countdown
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / delay;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-shironeri px-4 py-12">
      <WagaraPattern pattern="seigaiha" color="#B94047" opacity={0.06} />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        {/* Countdown circle */}
        <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60" cy="60" r={radius}
              stroke="currentColor" strokeWidth="3"
              className="text-hai/30"
            />
            <circle
              cx="60" cy="60" r={radius}
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round"
              className="text-beni transition-[stroke-dashoffset] duration-1000 ease-linear"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="text-4xl font-light tabular-nums text-sumi sm:text-5xl">
            {remaining}
          </span>
        </div>

        {/* Link info */}
        {(title || creatorName) && (
          <div className="text-center space-y-1.5">
            {title && (
              <h1 className="text-xl font-light text-sumi sm:text-2xl">
                {title}
              </h1>
            )}
            {creatorName && (
              <p className="text-sm text-ginnezumi">
                {t("by")} <span className="font-medium text-sumi">@{creatorName}</span>
              </p>
            )}
          </div>
        )}

        {/* Target URL */}
        <div className="w-full rounded-xl border border-hai/60 bg-white/70 px-4 py-3 backdrop-blur-sm">
          <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-ginnezumi/50">
            {t("redirectingTo")}
          </p>
          <p className="truncate text-sm text-sumi">{targetUrl}</p>
        </div>

        {/* Skip button */}
        <button
          onClick={doRedirect}
          disabled={redirecting}
          className="w-full rounded-xl border border-hai bg-white/80 py-3 text-sm text-ginnezumi shadow-sm transition-all hover:border-sumi hover:text-sumi hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {redirecting ? "..." : t("goNow")}
        </button>

        {/* Footer branding */}
        <a
          href="https://l.devminds.online"
          className="text-[11px] text-ginnezumi/25 transition-colors hover:text-ginnezumi/50"
        >
          Powered by DevMinds Links
        </a>
      </div>
    </div>
  );
}
