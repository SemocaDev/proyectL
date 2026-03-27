"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { WagaraPattern } from "@/components/patterns";
import { colors } from "@/lib/css-vars";
import { DevMindsCredit } from "./devminds-credit";

export function Footer() {
  const t = useTranslations("footer");
  const tLegal = useTranslations("legal");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-hai/50 bg-shironeri overflow-hidden">
      {/* Patrón tokusa sutil en el footer */}
      <WagaraPattern pattern="tokusa" color={colors.ginnezumi} opacity={0.045} static />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 md:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="block h-3.5 w-px bg-beni/60" />
            <span className="font-credit text-xs font-semibold tracking-tight text-sumi/70">
              DevMinds Links
            </span>
          </div>

          {/* Center: rights + legal links */}
          <div className="flex items-center gap-3 text-[11px] text-ginnezumi/50">
            <span>© {currentYear} · {t("rights")}</span>
            <span>·</span>
            <Link href="/legal/terms" className="hover:text-ginnezumi transition-colors">
              {tLegal("terms")}
            </Link>
            <span>·</span>
            <Link href="/legal/privacy" className="hover:text-ginnezumi transition-colors">
              {tLegal("privacy")}
            </Link>
          </div>

          {/* Dev credit */}
          <p className="text-[11px] text-ginnezumi/50">
            {t("devBy")} <DevMindsCredit />
          </p>
        </div>
      </div>
    </footer>
  );
}
