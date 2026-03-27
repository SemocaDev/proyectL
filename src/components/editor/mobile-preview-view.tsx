"use client";

import { useTranslations } from "next-intl";
import { LinkhubPreview } from "./linkhub-preview";
import type { LandingData } from "@/lib/schemas";

interface MobilePreviewViewProps {
  data: LandingData;
  onBack: () => void;
}

export function MobilePreviewView({ data, onBack }: MobilePreviewViewProps) {
  const t = useTranslations("editor");

  return (
    <div className="flex min-h-full flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-hai/30 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-ginnezumi transition-colors hover:text-sumi"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t("backToEdit")}
        </button>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-ginnezumi/40">
          {t("mobilePreview")}
        </span>
      </div>

      {/* Full-width preview — no phone frame */}
      <div className="flex-1">
        <LinkhubPreview data={data} embedded={false} />
      </div>
    </div>
  );
}
