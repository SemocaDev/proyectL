"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm px-4 pb-6 sm:px-0 sm:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="mb-3 flex items-center justify-between sm:mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            {t("preview")}
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <PhoneFrame>
          <LinkhubPreview data={data} />
        </PhoneFrame>
      </div>
    </div>
  );
}
