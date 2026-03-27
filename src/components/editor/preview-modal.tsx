"use client";

import { useTranslations } from "next-intl";
import { PhoneFrame } from "./phone-frame";
import { LinkhubPreview } from "./linkhub-preview";
import type { LandingData } from "@/lib/schemas";

interface PreviewModalProps {
  data: LandingData;
  open: boolean;
  onClose: () => void;
}

export function PreviewModal({ data, open, onClose }: PreviewModalProps) {
  const t = useTranslations("editor");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-sm text-white/80 transition-colors hover:text-white"
        >
          {t("closePreview")} ✕
        </button>

        <PhoneFrame>
          <LinkhubPreview data={data} />
        </PhoneFrame>
      </div>
    </div>
  );
}
