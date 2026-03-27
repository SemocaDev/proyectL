"use client";

import { useTranslations } from "next-intl";
import { colors } from "@/lib/css-vars";
import type { Theme } from "@/lib/schemas";

interface ThemeSectionProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

const ACCENT_COLORS = [
  colors.beni,    // beni (default)
  "#2563EB",      // blue
  "#059669",      // emerald
  "#7C3AED",      // violet
  "#DB2777",      // pink
  "#EA580C",      // orange
  "#0D9488",      // teal
  "#1a1a1a",      // dark
];

const BG_THEMES: { value: "light" | "cream" | "dark"; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "cream", label: "Cream" },
  { value: "dark", label: "Dark" },
];

export function ThemeSection({ theme, onChange }: ThemeSectionProps) {
  const t = useTranslations("editor");

  return (
    <section className="space-y-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("appearance")}
      </h3>

      {/* Accent color */}
      <div className="space-y-2">
        <label className="text-xs text-ginnezumi">{t("accentColor")}</label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ ...theme, accentColor: color })}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                (theme.accentColor ?? colors.beni) === color
                  ? "border-sumi scale-110 ring-2 ring-sumi/20"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Background theme */}
      <div className="space-y-2">
        <label className="text-xs text-ginnezumi">{t("background")}</label>
        <div className="grid grid-cols-3 gap-2">
          {BG_THEMES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...theme, bgTheme: value })}
              className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
                (theme.bgTheme ?? "light") === value
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
