"use client";

import { useState, useEffect, useCallback } from "react";
import { WagaraPattern } from "@/components/wagara-pattern";

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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-shironeri px-4">
      <WagaraPattern pattern="seigaiha" opacity={0.02} />

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Countdown circle */}
        <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 120 120"
            fill="none"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              className="text-hai/30"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-beni transition-[stroke-dashoffset] duration-1000 ease-linear"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="text-4xl font-light text-sumi sm:text-5xl">
            {remaining}
          </span>
        </div>

        {/* Link info */}
        <div className="text-center space-y-2">
          {title && (
            <h1 className="text-xl font-light text-sumi sm:text-2xl">
              {title}
            </h1>
          )}
          {creatorName && (
            <p className="text-sm text-ginnezumi">
              por <span className="text-sumi">@{creatorName}</span>
            </p>
          )}
        </div>

        {/* Target URL preview */}
        <div className="max-w-sm rounded-lg border border-hai bg-white/80 px-4 py-2.5">
          <p className="truncate text-xs text-ginnezumi/60">{targetUrl}</p>
        </div>

        {/* Skip button */}
        <button
          onClick={doRedirect}
          disabled={redirecting}
          className="rounded-lg border border-hai px-6 py-2.5 text-sm text-ginnezumi transition-colors hover:border-sumi hover:text-sumi disabled:opacity-50"
        >
          {redirecting ? "..." : "Ir ahora →"}
        </button>

        {/* Footer branding */}
        <a
          href="https://l.devminds.online"
          className="mt-4 text-[11px] text-ginnezumi/25 transition-colors hover:text-ginnezumi/50"
        >
          Powered by DevMinds Links
        </a>
      </div>
    </div>
  );
}
