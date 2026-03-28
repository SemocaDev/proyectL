"use client";

import { useTranslations } from "next-intl";
import { WagaraPattern } from "@/components/patterns";
import type { BgPattern } from "@/lib/schemas";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface BgPatternPickerProps {
  bgColor: string;                          // color de fondo activo (hex)
  bgPattern: BgPattern;
  patternOpacity: number;
  patternAnimated: boolean;
  cardColor: string | undefined;            // color de la tarjeta de contenido (undefined = sin tarjeta)
  onBgColorChange: (hex: string) => void;
  onBgPatternChange: (v: BgPattern) => void;
  onPatternOpacityChange: (v: number) => void;
  onPatternAnimatedChange: (v: boolean) => void;
  onCardColorChange: (v: string | undefined) => void;
}

// ── Paleta de colores predefinidos (16 + libre) ───────────────────────────────

const BG_COLOR_PRESETS: { hex: string; label: string; dark: boolean }[] = [
  // Neutros
  { hex: "#FFFFFF",  label: "Blanco",      dark: false },
  { hex: "#FAF7F2",  label: "Crema",       dark: false },
  { hex: "#F1F5F9",  label: "Gris claro",  dark: false },
  { hex: "#1a1a1a",  label: "Negro",       dark: true  },
  // Cálidos
  { hex: "#FFF5F5",  label: "Rosa pálido", dark: false },
  { hex: "#FFF7ED",  label: "Melocotón",   dark: false },
  { hex: "#FFFBEB",  label: "Mantequilla", dark: false },
  { hex: "#7C2D12",  label: "Terracota",   dark: true  },
  // Fríos
  { hex: "#EFF6FF",  label: "Azul pálido", dark: false },
  { hex: "#F0FDF4",  label: "Menta",       dark: false },
  { hex: "#F5F3FF",  label: "Lavanda",     dark: false },
  { hex: "#0F172A",  label: "Noche",       dark: true  },
  // Saturados
  { hex: "#B94047",  label: "Beni",        dark: true  },
  { hex: "#2A4C7D",  label: "Índigo",      dark: true  },
  { hex: "#3D5A3E",  label: "Bosque",      dark: true  },
  { hex: "#5B3D7A",  label: "Ciruela",     dark: true  },
];

// ── Todos los patrones wagara ─────────────────────────────────────────────────

const PATTERN_OPTIONS: { value: BgPattern; label: string }[] = [
  { value: "none",      label: "Ninguno"   },
  { value: "seigaiha",  label: "Seigaiha"  },
  { value: "asanoha",   label: "Asanoha"   },
  { value: "kikko",     label: "Kikko"     },
  { value: "shippo",    label: "Shippo"    },
  { value: "ichimatsu", label: "Ichimatsu" },
  { value: "ryusuimon", label: "Ryūsui"   },
  { value: "tokusa",    label: "Tokusa"    },
  { value: "uroko",     label: "Uroko"     },
  { value: "karakusa",  label: "Karakusa"  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Determina si el color de fondo es oscuro para elegir el color del patrón */
function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Luminancia relativa perceptual
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

// ── Componente ────────────────────────────────────────────────────────────────

const CARD_COLOR_PRESETS: { hex: string; label: string; dark: boolean }[] = [
  { hex: "#FFFFFF",  label: "Blanco", dark: false },
  { hex: "#FAF7F2",  label: "Crema",  dark: false },
  { hex: "#1a1a1a",  label: "Oscuro", dark: true  },
  { hex: "#F1F5F9",  label: "Gris",   dark: false },
];

export function BgPatternPicker({
  bgColor,
  bgPattern,
  patternOpacity,
  patternAnimated,
  cardColor,
  onBgColorChange,
  onBgPatternChange,
  onPatternOpacityChange,
  onPatternAnimatedChange,
  onCardColorChange,
}: BgPatternPickerProps) {
  const t = useTranslations("editor");
  const patternColor = isDarkColor(bgColor) ? "#ffffff" : "#111827";

  return (
    <div className="space-y-5">

      {/* ── Color de fondo ── */}
      <div className="space-y-2.5">
        <p className="text-xs text-ginnezumi">{t("bgSolid")}</p>

        {/* Grid 4×4 de presets + picker libre */}
        <div className="grid grid-cols-5 gap-2">
          {BG_COLOR_PRESETS.map((preset) => {
            const isSelected = bgColor === preset.hex;
            return (
              <button
                key={preset.hex}
                type="button"
                title={preset.label}
                onClick={() => onBgColorChange(preset.hex)}
                className={`relative h-9 w-full rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? "border-beni ring-1 ring-beni ring-offset-1 scale-105"
                    : "border-transparent hover:border-ginnezumi/20"
                }`}
                style={{ backgroundColor: preset.hex }}
              >
                {isSelected && (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{ color: preset.dark ? "#ffffff" : "#111827" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          {/* Picker de color libre */}
          <label
            title="Color personalizado"
            className={`relative flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border-2 transition-all hover:scale-105 ${
              !BG_COLOR_PRESETS.some((p) => p.hex === bgColor)
                ? "border-beni ring-1 ring-beni ring-offset-1 scale-105"
                : "border-dashed border-ginnezumi/30 hover:border-ginnezumi/50"
            }`}
            style={
              !BG_COLOR_PRESETS.some((p) => p.hex === bgColor)
                ? { backgroundColor: bgColor }
                : undefined
            }
          >
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="sr-only"
            />
            {BG_COLOR_PRESETS.some((p) => p.hex === bgColor) && (
              <span className="text-base leading-none text-ginnezumi/40">+</span>
            )}
          </label>
        </div>

        {/* Color activo — muestra el hex */}
        <div className="flex items-center gap-2">
          <div
            className="h-5 w-5 shrink-0 rounded border border-hai/60"
            style={{ backgroundColor: bgColor }}
          />
          <span className="font-mono text-[11px] text-ginnezumi/60 uppercase">{bgColor}</span>
        </div>
      </div>

      {/* ── Patrón wagara ── */}
      <div className="space-y-2.5">
        <p className="text-xs text-ginnezumi">{t("bgPattern")}</p>
        <div className="grid grid-cols-5 gap-2">
          {PATTERN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onBgPatternChange(opt.value)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                bgPattern === opt.value
                  ? "border-beni ring-1 ring-beni"
                  : "border-hai hover:border-ginnezumi/30"
              }`}
            >
              <div
                className="relative h-11 w-full"
                style={{ backgroundColor: bgColor }}
              >
                {opt.value === "none" ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm" style={{ color: patternColor, opacity: 0.3 }}>✕</span>
                  </div>
                ) : (
                  <WagaraPattern
                    pattern={opt.value}
                    opacity={0.3}
                    color={patternColor}
                    static
                  />
                )}
              </div>
              <p className="py-1 text-center text-[9px] font-medium text-ginnezumi capitalize leading-tight">
                {opt.value === "none" ? t("noPattern") : opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Slider opacidad del patrón ── */}
      {bgPattern !== "none" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-ginnezumi">{t("patternOpacity")}</p>
            <span className="text-xs font-medium text-sumi">
              {Math.round(patternOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.20}
            step={0.01}
            value={patternOpacity}
            onChange={(e) => onPatternOpacityChange(Number(e.target.value))}
            className="w-full accent-beni"
          />
          <div className="flex justify-between text-[10px] text-ginnezumi/40">
            <span>2%</span>
            <span>20%</span>
          </div>
        </div>
      )}

      {/* ── Toggle animación del patrón ── */}
      {bgPattern !== "none" && (
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-xs text-ginnezumi">{t("patternAnimated")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={patternAnimated}
            onClick={() => onPatternAnimatedChange(!patternAnimated)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              patternAnimated ? "bg-beni" : "bg-hai"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                patternAnimated ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      )}

      {/* ── Tarjeta de contenido ── */}
      <div className="space-y-2.5">
        <p className="text-xs text-ginnezumi">{t("cardColor")}</p>
        <div className="flex flex-wrap gap-2">
          {/* Sin tarjeta */}
          <button
            type="button"
            onClick={() => onCardColorChange(undefined)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all hover:scale-105 ${
              !cardColor
                ? "border-beni ring-1 ring-beni ring-offset-1 scale-105"
                : "border-dashed border-ginnezumi/30 hover:border-ginnezumi/50"
            }`}
          >
            <span className="text-xs text-ginnezumi/40">✕</span>
          </button>

          {CARD_COLOR_PRESETS.map((preset) => {
            const isSelected = cardColor === preset.hex;
            return (
              <button
                key={preset.hex}
                type="button"
                title={preset.label}
                onClick={() => onCardColorChange(preset.hex)}
                className={`relative h-9 w-9 rounded-lg border-2 shadow-sm transition-all hover:scale-105 ${
                  isSelected
                    ? "border-beni ring-1 ring-beni ring-offset-1 scale-105"
                    : "border-transparent hover:border-ginnezumi/20"
                }`}
                style={{ backgroundColor: preset.hex }}
              >
                {isSelected && (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{ color: preset.dark ? "#ffffff" : "#111827" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          {/* Color personalizado */}
          <label
            title="Color personalizado"
            className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 transition-all hover:scale-105 ${
              cardColor && !CARD_COLOR_PRESETS.some((p) => p.hex === cardColor)
                ? "border-beni ring-1 ring-beni ring-offset-1 scale-105"
                : "border-dashed border-ginnezumi/30 hover:border-ginnezumi/50"
            }`}
            style={
              cardColor && !CARD_COLOR_PRESETS.some((p) => p.hex === cardColor)
                ? { backgroundColor: cardColor }
                : undefined
            }
          >
            <input
              type="color"
              value={cardColor ?? "#FFFFFF"}
              onChange={(e) => onCardColorChange(e.target.value)}
              className="sr-only"
            />
            {(!cardColor || CARD_COLOR_PRESETS.some((p) => p.hex === cardColor)) && (
              <span className="text-base leading-none text-ginnezumi/40">+</span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
