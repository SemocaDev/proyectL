"use client";

import { useTranslations } from "next-intl";
import type { ButtonStyle } from "@/lib/schemas";

interface ButtonStylePickerProps {
  style: ButtonStyle;
  onChange: (style: ButtonStyle) => void;
}

const SHAPES: { value: ButtonStyle["shape"]; label: string }[] = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp" },
  { value: "pill", label: "Pill" },
];

const VARIANTS: { value: ButtonStyle["variant"]; label: string }[] = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
];

export function ButtonStylePicker({ style, onChange }: ButtonStylePickerProps) {
  const t = useTranslations("editor");

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("buttonStyle")}
      </h3>

      {/* Shape */}
      <div className="space-y-2">
        <label className="text-xs text-ginnezumi">{t("shape")}</label>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map(({ value, label }) => {
            const radiusClass =
              value === "pill"
                ? "rounded-full"
                : value === "sharp"
                  ? "rounded-none"
                  : "rounded-lg";
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...style, shape: value })}
                className={`border px-3 py-2 text-xs font-medium transition-all ${radiusClass} ${
                  style.shape === value
                    ? "border-beni bg-beni/5 text-beni"
                    : "border-hai bg-white text-ginnezumi hover:border-sumi/30"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Variant */}
      <div className="space-y-2">
        <label className="text-xs text-ginnezumi">{t("variant")}</label>
        <div className="grid grid-cols-2 gap-2">
          {VARIANTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...style, variant: value })}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                style.variant === value
                  ? "border-beni bg-beni/5 text-beni"
                  : "border-hai bg-white text-ginnezumi hover:border-sumi/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
