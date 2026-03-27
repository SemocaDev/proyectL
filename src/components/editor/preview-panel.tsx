"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LinkhubPreview } from "./linkhub-preview";
import type { LandingData } from "@/lib/schemas";

interface PreviewPanelProps {
  data: LandingData;
}

export function PreviewPanel({ data }: PreviewPanelProps) {
  const t = useTranslations("editor");
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");

  return (
    <div className="flex h-full flex-col">
      {/* Header con toggle */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hai/20 bg-white/80 px-5 py-3 backdrop-blur-sm">
        <span className="text-[10px] font-medium uppercase tracking-wider text-ginnezumi/50">
          {t("preview")}
        </span>
        <div className="flex overflow-hidden rounded-lg border border-hai">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`px-3 py-1.5 text-xs transition-colors ${
              viewport === "mobile"
                ? "bg-sumi text-white"
                : "text-ginnezumi hover:bg-shironeri"
            }`}
          >
            {t("viewportMobile")}
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`border-l border-hai px-3 py-1.5 text-xs transition-colors ${
              viewport === "desktop"
                ? "bg-sumi text-white"
                : "text-ginnezumi hover:bg-shironeri"
            }`}
          >
            {t("viewportDesktop")}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto bg-hai/15 p-6">
        <div
          className={`overflow-hidden shadow-xl ring-1 ring-sumi/10 transition-all duration-300 ${
            viewport === "mobile"
              ? "w-97.5 rounded-3xl"
              : "w-full max-w-2xl rounded-xl"
          }`}
        >
          <LinkhubPreview data={data} />
        </div>
      </div>
    </div>
  );
}
