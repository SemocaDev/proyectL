"use client";

import { useTranslations } from "next-intl";
import { AvatarPicker } from "./sections/avatar-picker";
import { LinksSection } from "./sections/links-section";
import { BgPatternPicker } from "./sections/bg-pattern-picker";
import { ButtonStylePicker } from "./sections/button-style-picker";
import { colors } from "@/lib/css-vars";
import type { LinkhubLinkItem, Theme } from "@/lib/schemas";

export type EditorTab = "profile" | "links" | "design";

interface EditorTabPanelProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  /** Hide the top tab bar (used on mobile where MobileTabBar handles navigation) */
  hideTabBar?: boolean;
  wizard?: boolean;
  tabValidity?: Record<EditorTab, boolean>;
  tabAttempted?: Set<EditorTab>;
  // Data
  title: string;
  bio: string;
  avatar: string | undefined;
  links: LinkhubLinkItem[];
  theme: Theme;
  // Callbacks
  onTitleChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onAvatarChange: (v: string | undefined) => void;
  onLinksChange: (links: LinkhubLinkItem[]) => void;
  onThemeChange: (theme: Theme) => void;
}

const ACCENT_COLORS = [
  { hex: colors.beni,   label: "Beni"     },
  { hex: "#2563EB",     label: "Azul"     },
  { hex: "#059669",     label: "Esmeralda"},
  { hex: "#7C3AED",     label: "Violeta"  },
  { hex: "#DB2777",     label: "Rosa"     },
  { hex: "#EA580C",     label: "Naranja"  },
  { hex: "#0D9488",     label: "Verde"    },
  { hex: "#1a1a1a",     label: "Oscuro"   },
];

// ── Tab icons ─────────────────────────────────────────────────────────────────

function IconProfile() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconLinks() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function IconDesign() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  );
}

// ── Color picker control ────────────────────────────────────────────────────

function ColorControl({
  label,
  value,
  fallback,
  onChange,
  onReset,
}: {
  label: string;
  value: string | undefined;
  fallback: string;
  onChange: (v: string) => void;
  onReset: () => void;
}) {
  const active = value ?? fallback;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <label className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-hai transition-all hover:border-ginnezumi/40 hover:scale-105">
        <input
          type="color"
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <div className="h-full w-full" style={{ backgroundColor: active }} />
      </label>
      <span className="text-[10px] text-ginnezumi/60">{label}</span>
      {value && (
        <button
          type="button"
          onClick={onReset}
          className="text-[9px] text-ginnezumi/40 hover:text-shu transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EditorTabPanel({
  activeTab,
  onTabChange,
  hideTabBar,
  wizard,
  tabValidity,
  tabAttempted,
  title,
  bio,
  avatar,
  links,
  theme,
  onTitleChange,
  onBioChange,
  onAvatarChange,
  onLinksChange,
  onThemeChange,
}: EditorTabPanelProps) {
  const t = useTranslations("editor");

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: t("tabProfile"), icon: <IconProfile /> },
    { id: "links",   label: t("tabLinks"),   icon: <IconLinks />   },
    { id: "design",  label: t("tabDesign"),  icon: <IconDesign />  },
  ];

  return (
    <div className="flex flex-col">
      {/* ── Sticky tab bar (hidden on mobile where MobileTabBar is used) ── */}
      {!hideTabBar && (
        <div className="sticky top-0 z-10 flex border-b border-hai/40 bg-white">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const valid    = tabValidity?.[tab.id] ?? true;
            const tried    = tabAttempted?.has(tab.id) ?? false;
            const isDesign = tab.id === "design";
            const showOk  = wizard && (valid || isDesign) && (tried || isActive);
            const showErr = wizard && !valid && !isDesign && tried;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:text-xs ${
                  isActive
                    ? "border-b-2 border-beni text-beni"
                    : "text-ginnezumi/60 hover:text-sumi"
                }`}
              >
                {tab.icon}
                {tab.label}
                {showOk && (
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-uguisu text-[9px] text-white">
                    ✓
                  </span>
                )}
                {showErr && (
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-shu text-[9px] text-white">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Tab content ── */}
      <div className="px-4 py-5 sm:px-5">

        {/* ── Perfil ── */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <AvatarPicker value={avatar} onChange={onAvatarChange} />

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("title")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                maxLength={100}
                placeholder={t("titlePlaceholder")}
                className="w-full rounded-xl border border-hai bg-shironeri px-3 py-2.5 text-sm text-sumi focus:border-beni focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                  {t("bio")}
                </label>
                <span className="text-[10px] text-ginnezumi/40">{bio.length}/300</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => onBioChange(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder={t("bioPlaceholder")}
                className="w-full resize-none rounded-xl border border-hai bg-shironeri px-3 py-2.5 text-sm text-sumi focus:border-beni focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ── Links ── */}
        {activeTab === "links" && (
          <LinksSection links={links} onChange={onLinksChange} />
        )}

        {/* ── Diseño ── */}
        {activeTab === "design" && (
          <div className="space-y-6">

            {/* Color de acento */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("accentColor")}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {ACCENT_COLORS.map(({ hex, label }) => (
                  <button
                    key={hex}
                    type="button"
                    title={label}
                    onClick={() => onThemeChange({ ...theme, accentColor: hex })}
                    className={`h-9 w-9 rounded-full border-2 transition-all hover:scale-110 ${
                      (theme.accentColor ?? colors.beni) === hex
                        ? "border-sumi scale-110 ring-2 ring-sumi/20"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Fondo */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("background")}
              </p>
              <BgPatternPicker
                bgColor={theme.bgColor ?? (
                  theme.bgTheme === "dark" ? "#1a1a1a"
                  : theme.bgTheme === "cream" ? "#FAF7F2"
                  : "#FFFFFF"
                )}
                bgPattern={theme.bgPattern ?? "none"}
                patternOpacity={theme.patternOpacity ?? 0.06}
                patternAnimated={theme.patternAnimated ?? false}
                cardColor={theme.cardColor}
                onBgColorChange={(hex) => onThemeChange({ ...theme, bgColor: hex })}
                onBgPatternChange={(v) => onThemeChange({ ...theme, bgPattern: v })}
                onPatternOpacityChange={(v) => onThemeChange({ ...theme, patternOpacity: v })}
                onPatternAnimatedChange={(v) => onThemeChange({ ...theme, patternAnimated: v })}
                onCardColorChange={(v) => onThemeChange({ ...theme, cardColor: v })}
              />
            </div>

            {/* Estilo de botones */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("buttonStyle")}
              </p>
              <ButtonStylePicker
                style={theme.buttonStyle ?? { shape: "rounded", variant: "filled" }}
                onChange={(bs) => onThemeChange({ ...theme, buttonStyle: bs })}
              />
            </div>

            {/* Colores de botón */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("buttonColors")}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {/* Relleno */}
                <ColorControl
                  label={t("buttonBgColor")}
                  value={theme.buttonBgColor}
                  fallback={theme.accentColor ?? colors.beni}
                  onChange={(v) => onThemeChange({ ...theme, buttonBgColor: v })}
                  onReset={() => onThemeChange({ ...theme, buttonBgColor: undefined })}
                />
                {/* Texto */}
                <ColorControl
                  label={t("buttonTextColor")}
                  value={theme.buttonTextColor}
                  fallback="#FFFFFF"
                  onChange={(v) => onThemeChange({ ...theme, buttonTextColor: v })}
                  onReset={() => onThemeChange({ ...theme, buttonTextColor: undefined })}
                />
                {/* Borde */}
                <ColorControl
                  label={t("buttonBorderColor")}
                  value={theme.buttonBorderColor}
                  fallback={theme.accentColor ?? colors.beni}
                  onChange={(v) => onThemeChange({ ...theme, buttonBorderColor: v })}
                  onReset={() => onThemeChange({ ...theme, buttonBorderColor: undefined })}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
