"use client";

import { PLATFORM_ICONS } from "@/lib/platform-icons";
import type { LandingData, ButtonStyle } from "@/lib/schemas";

interface LinkhubPreviewProps {
  data: LandingData;
  /** When true, renders at full page size (for the public [code] page) */
  embedded?: boolean;
}

const BG_THEMES = {
  light: "bg-white text-sumi",
  cream: "bg-[#FAF7F2] text-sumi",
  dark: "bg-[#1a1a1a] text-white",
} as const;

function getButtonClasses(style?: ButtonStyle, bgTheme?: string): string {
  const shape = style?.shape ?? "rounded";
  const variant = style?.variant ?? "filled";
  const isDark = bgTheme === "dark";

  const shapeClass =
    shape === "pill"
      ? "rounded-full"
      : shape === "sharp"
        ? "rounded-none"
        : "rounded-lg";

  const variantClass =
    variant === "outline"
      ? isDark
        ? "border border-white/30 bg-transparent hover:bg-white/10"
        : "border border-hai bg-transparent hover:bg-black/5"
      : isDark
        ? "bg-white/15 hover:bg-white/20"
        : "bg-white shadow-sm hover:shadow-md";

  return `${shapeClass} ${variantClass}`;
}

function getTextColor(bgTheme?: string): string {
  return bgTheme === "dark" ? "text-white" : "text-sumi";
}

function getSubTextColor(bgTheme?: string): string {
  return bgTheme === "dark" ? "text-white/60" : "text-ginnezumi";
}

export function LinkhubPreview({ data, embedded }: LinkhubPreviewProps) {
  const accent = data.theme?.accentColor ?? "#B94047";
  const bgTheme = data.theme?.bgTheme ?? "light";
  const displayTitle = data.title;
  const textColor = getTextColor(bgTheme);
  const subTextColor = getSubTextColor(bgTheme);
  const btnClasses = getButtonClasses(data.theme?.buttonStyle, bgTheme);

  const wrapperClass = embedded
    ? `relative min-h-screen ${BG_THEMES[bgTheme]}`
    : `relative h-full ${BG_THEMES[bgTheme]}`;

  return (
    <div className={wrapperClass}>
      <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
        {/* Profile header */}
        <div className="mb-8 text-center space-y-3">
          <div
            className="mx-auto h-px w-12"
            style={{ backgroundColor: accent }}
          />
          {displayTitle && (
            <h1 className={`text-xl font-light sm:text-2xl ${textColor}`}>
              {displayTitle}
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
          <div className="space-y-3">
            {data.links.map((item, i) => {
              const IconComp = item.icon ? PLATFORM_ICONS[item.icon]?.svg : null;
              return (
                <a
                  key={i}
                  href={embedded ? item.url : undefined}
                  target={embedded ? "_blank" : undefined}
                  rel={embedded ? "noopener noreferrer" : undefined}
                  onClick={embedded ? undefined : (e) => e.preventDefault()}
                  className={`flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all active:scale-[0.98] ${btnClasses} ${textColor}`}
                  style={
                    data.theme?.buttonStyle?.variant !== "outline"
                      ? { borderLeftColor: accent, borderLeftWidth: "3px" }
                      : undefined
                  }
                >
                  {IconComp && (
                    <IconComp className="h-4 w-4 shrink-0 opacity-60" />
                  )}
                  <span className="flex-1 text-center">{item.label}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div
            className={`rounded-lg border border-dashed py-12 text-center ${
              bgTheme === "dark"
                ? "border-white/20 bg-white/5"
                : "border-hai bg-white/60"
            }`}
          >
            <p className={`text-sm ${subTextColor}`}>
              Agrega links para ver el preview
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <span
            className={`text-[11px] ${
              bgTheme === "dark" ? "text-white/20" : "text-ginnezumi/30"
            }`}
          >
            Powered by DevMinds Links
          </span>
        </div>
      </div>
    </div>
  );
}
