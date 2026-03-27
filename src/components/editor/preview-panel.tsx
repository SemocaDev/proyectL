"use client";

import { PhoneFrame } from "./phone-frame";
import { LinkhubPreview } from "./linkhub-preview";
import type { LandingData } from "@/lib/schemas";

interface PreviewPanelProps {
  data: LandingData;
}

export function PreviewPanel({ data }: PreviewPanelProps) {
  return (
    <div className="flex items-start justify-center py-6">
      <PhoneFrame>
        <LinkhubPreview data={data} />
      </PhoneFrame>
    </div>
  );
}
