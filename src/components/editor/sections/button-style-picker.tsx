"use client";

import { useTranslations } from "next-intl";
import { getButtonClasses } from "@/lib/button-utils";
import { colors } from "@/lib/css-vars";
import type { ButtonStyle } from "@/lib/schemas";

interface ButtonStylePickerProps {
  style: ButtonStyle;
  onChange: (style: ButtonStyle) => void;
}

const COMBOS: { shape: ButtonStyle["shape"]; variant: ButtonStyle["variant"]; label: string }[] = [
  { shape: "rounded", variant: "filled",  label: "Redondeado · Sólido"  },
  { shape: "rounded", variant: "outline", label: "Redondeado · Borde"   },
  { shape: "sharp",   variant: "filled",  label: "Recto · Sólido"       },
  { shape: "sharp",   variant: "outline", label: "Recto · Borde"        },
  { shape: "pill",    variant: "filled",  label: "Píldora · Sólido"     },
  { shape: "pill",    variant: "outline", label: "Píldora · Borde"      },
];

export function ButtonStylePicker({ style, onChange }: ButtonStylePickerProps) {
  const t = useTranslations("editor");

  return (
    <div className="space-y-2">
      <p className="text-xs text-ginnezumi">{t("buttonStyle")}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {COMBOS.map((combo) => {
          const isSelected = style.shape === combo.shape && style.variant === combo.variant;
          const btnClass = getButtonClasses({ shape: combo.shape, variant: combo.variant }, "light");

          return (
            <button
              key={`${combo.shape}-${combo.variant}`}
              type="button"
              onClick={() => onChange({ shape: combo.shape, variant: combo.variant })}
              className={`rounded-xl border-2 p-2.5 transition-all ${
                isSelected
                  ? "border-beni bg-beni/5"
                  : "border-hai hover:border-ginnezumi/30"
              }`}
            >
              {/* Botón mock renderizado visualmente */}
              <div
                className={`flex h-8 w-full items-center justify-center px-3 text-xs font-medium ${btnClass}`}
                style={{
                  color: combo.variant === "outline" ? colors.beni : colors.sumi,
                  borderColor: combo.variant === "outline" ? colors.hai : undefined,
                  pointerEvents: "none",
                }}
              >
                Enlace
              </div>
              <p className="mt-1.5 text-center text-[9px] text-ginnezumi/60 leading-tight">
                {combo.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
