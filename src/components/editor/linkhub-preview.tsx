"use client";

import { useTranslations } from "next-intl";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import { colors } from "@/lib/css-vars";
import { getButtonClasses, getShapeClass } from "@/lib/button-utils";
import { WagaraPattern } from "@/components/patterns";
import type { LandingData } from "@/lib/schemas";
import type { PatternType } from "@/components/patterns";

interface LinkhubPreviewProps {
  data: LandingData;
  /** When true, renders at full page size (for the public [code] page) */
  embedded?: boolean;
}

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

// ── Helpers de color ───────────────────────────────────────────────────────────

/** Luminancia perceptual — true si el color es oscuro */
function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

/** Color de texto principal según el fondo */
function resolveTextColor(bgHex: string): string {
  return isDark(bgHex) ? "text-white" : "text-sumi";
}

/** Color de texto secundario según el fondo */
function resolveSubTextColor(bgHex: string): string {
  return isDark(bgHex) ? "text-white/60" : "text-ginnezumi";
}

// Mapa de bgTheme heredado → hex (retrocompatibilidad con datos guardados sin bgColor)
const BG_THEME_HEX: Record<string, string> = {
  light: "#FFFFFF",
  cream: "#FAF7F2",
  dark:  "#1a1a1a",
};

export function LinkhubPreview({ data, embedded }: LinkhubPreviewProps) {
  const t = useTranslations("linkhub");

  const accent   = data.theme?.accentColor ?? colors.beni;
  const btnBorderColor = data.theme?.buttonBorderColor ?? null;
  const bgPattern      = data.theme?.bgPattern;
  const patternOpacity = data.theme?.patternOpacity ?? 0.06;

  // Resolución del color de fondo: bgColor tiene prioridad, luego bgTheme legacy, luego blanco
  const bgHex = data.theme?.bgColor
    ?? BG_THEME_HEX[data.theme?.bgTheme ?? "light"]
    ?? "#FFFFFF";

  const textColor    = resolveTextColor(bgHex);
  const subTextColor = resolveSubTextColor(bgHex);
  const isPageDark   = isDark(bgHex);
  const patternColor = isPageDark ? "#ffffff" : colors.sumi;

  const btnClasses = getButtonClasses(data.theme?.buttonStyle, isPageDark ? "dark" : "light");
  const shapeOnly  = getShapeClass(data.theme?.buttonStyle);
  const isFilled   = data.theme?.buttonStyle?.variant !== "outline";

  const wrapperStyle = { backgroundColor: bgHex };

  return (
    <div
      className={`relative ${embedded ? "min-h-screen" : "h-full min-h-full"}`}
      style={wrapperStyle}
    >
      {/* Patrón de fondo */}
      {bgPattern && bgPattern !== "none" && (
        <WagaraPattern
          pattern={bgPattern as PatternType}
          opacity={patternOpacity}
          color={patternColor}
          static
        />
      )}

      <div className={`relative z-10 mx-auto max-w-md px-4 ${embedded ? "py-12 sm:py-16" : "py-8"}`}>
        {/* Profile header */}
        <div className="mb-6 space-y-2.5 text-center">
          {/* Avatar emoji */}
          {data.avatar && (
            <div
              className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full text-5xl"
              style={{
                fontFamily: EMOJI_FONT,
                backgroundColor: isPageDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
              }}
            >
              {data.avatar}
            </div>
          )}

          <div className="mx-auto h-px w-10" style={{ backgroundColor: accent }} />

          {data.title && (
            <h1 className={`font-light ${embedded ? "text-xl sm:text-2xl" : "text-lg"} ${textColor}`}>
              {data.title}
            </h1>
          )}
          {data.bio && (
            <p className={`mx-auto max-w-xs text-sm leading-relaxed ${subTextColor}`}>
              {data.bio}
            </p>
          )}
        </div>

        {/* Link buttons */}
        {data.links && data.links.length > 0 ? (
          <div className="space-y-2.5">
            {data.links.map((item, i) => {
              const IconComp   = item.icon ? PLATFORM_ICONS[item.icon]?.svg : null;
              const isHigh     = !!item.highlighted;

              // Estilo inline para botones — soporta buttonBorderColor
              let inlineStyle: React.CSSProperties | undefined;
              if (isHigh) {
                inlineStyle = { backgroundColor: accent };
              } else if (isFilled) {
                inlineStyle = { borderLeftColor: accent, borderLeftWidth: "3px" };
              } else if (btnBorderColor) {
                // outline con color de borde personalizado
                inlineStyle = { borderColor: btnBorderColor };
              }

              return (
                <a
                  key={i}
                  href={embedded ? item.url : undefined}
                  target={embedded ? "_blank" : undefined}
                  rel={embedded ? "noopener noreferrer" : undefined}
                  onClick={embedded ? undefined : (e) => e.preventDefault()}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                    isHigh ? `${shapeOnly} text-white` : `${btnClasses} ${textColor}`
                  }`}
                  style={inlineStyle}
                >
                  {IconComp && <IconComp className="h-4 w-4 shrink-0 opacity-60" />}
                  <span className="flex-1 text-center">{item.label || "—"}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-lg border border-dashed py-10 text-center"
            style={{
              borderColor: isPageDark ? "rgba(255,255,255,0.2)" : "#E5E7EB",
              backgroundColor: isPageDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
            }}
          >
            <p className={`text-sm ${subTextColor}`}>
              {embedded ? t("settingUp") : t("noLinksPreview")}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          {embedded ? (
            <a
              href="https://l.devminds.online"
              className="text-[11px] transition-colors"
              style={{ color: isPageDark ? "rgba(255,255,255,0.2)" : "rgba(75,85,99,0.3)" }}
            >
              Powered by DevMinds Links
            </a>
          ) : (
            <span
              className="text-[10px]"
              style={{ color: isPageDark ? "rgba(255,255,255,0.15)" : "rgba(75,85,99,0.25)" }}
            >
              Powered by DevMinds Links
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
