"use client";

import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { DevMindsCredit } from "./devminds-credit";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hai/50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Separator className="mb-6 bg-hai/30" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-ginnezumi">
            {t("rights")} &middot; {currentYear}
          </p>
          <p className="text-sm text-ginnezumi">
            {t("devBy")} <DevMindsCredit />
          </p>
        </div>
      </div>
    </footer>
  );
}
