"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { stripUndefined } from "@/lib/clean-data";
import { BasicInfo } from "./sections/basic-info";
import { RedirectOptions } from "./sections/redirect-options";
import { EditorTabPanel } from "./editor-tab-panel";
import { MobilePreviewView } from "./mobile-preview-view";
import { MobileTabBar } from "./mobile-tab-bar";
import { PreviewPanel } from "./preview-panel";
import type { EditorTab } from "./editor-tab-panel";
import type {
  LandingData,
  LinkhubLinkItem,
  Theme,
  ButtonStyle,
} from "@/lib/schemas";

export interface LinkEditorData {
  targetUrl: string;
  title: string;
  mode: "redirect" | "linkhub";
  redirectDelay: number;
  landingData: LandingData;
}

interface LinkEditorProps {
  mode: "redirect" | "linkhub";
  initial?: Partial<LinkEditorData>;
  onSave: (data: LinkEditorData) => Promise<void>;
  saveLabel?: string;
  onDirtyChange?: (dirty: boolean) => void;
  /** Step-by-step mode: Next button per tab, Save only on last tab */
  wizard?: boolean;
}

const TAB_ORDER: EditorTab[] = ["profile", "links", "design"];

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

export function LinkEditor({ mode, initial, onSave, saveLabel, onDirtyChange, wizard = false }: LinkEditorProps) {
  const t = useTranslations("editor");
  const tc = useTranslations("common");
  const isLinkhub = mode === "linkhub";

  // ── Shared state ──────────────────────────────────────────────────────────
  const [targetUrl, setTargetUrl] = useState(initial?.targetUrl ?? "");
  const [title, setTitle] = useState(initial?.title ?? initial?.landingData?.title ?? "");
  const [redirectDelay, setRedirectDelay] = useState(initial?.redirectDelay ?? 0);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // ── Linkhub-only state ────────────────────────────────────────────────────
  const [bio, setBio] = useState(initial?.landingData?.bio ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(initial?.landingData?.avatar);
  const [links, setLinks] = useState<LinkhubLinkItem[]>(
    initial?.landingData?.links ?? []
  );
  const [theme, setTheme] = useState<Theme>(
    initial?.landingData?.theme ?? {}
  );
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(
    initial?.landingData?.theme?.buttonStyle ?? { shape: "rounded", variant: "filled" }
  );

  // ── Mobile / tab navigation ───────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [activeTab, setActiveTab] = useState<EditorTab>("profile");

  // ── Wizard: track which tabs the user has tried to advance from ───────────
  const [attempted, setAttempted] = useState<Set<EditorTab>>(new Set());

  // ── Dirty tracking ────────────────────────────────────────────────────────
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl, title, redirectDelay, bio, avatar, links, theme, buttonStyle]);

  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useUnsavedChanges(dirty, tc("unsavedChanges"));

  // ── Validation ────────────────────────────────────────────────────────────
  const profileValid = title.trim().length > 0;
  const linksValid   = links.filter((l) => l.url.trim() && isValidUrl(l.url)).length > 0;

  function errorForTab(tab: EditorTab): string | null {
    if (tab === "profile" && !profileValid) return t("errorTitleRequired");
    if (tab === "links"   && !linksValid)   return t("errorLinksRequired");
    return null;
  }

  // ── Wizard step navigation ────────────────────────────────────────────────
  function handleNext() {
    setAttempted((prev) => new Set([...prev, activeTab]));
    const err = errorForTab(activeTab);
    if (err) return; // stays on current tab, error shown
    const nextIndex = TAB_ORDER.indexOf(activeTab) + 1;
    if (nextIndex < TAB_ORDER.length) setActiveTab(TAB_ORDER[nextIndex]);
  }

  function handleTabChange(tab: EditorTab) {
    if (!wizard) { setActiveTab(tab); return; }
    // In wizard mode allow going back freely, forward only if current step is valid
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const targetIndex  = TAB_ORDER.indexOf(tab);
    if (targetIndex <= currentIndex) { setActiveTab(tab); return; }
    // Mark all intermediate tabs as attempted before jumping forward
    const newAttempted = new Set(attempted);
    for (let i = currentIndex; i < targetIndex; i++) newAttempted.add(TAB_ORDER[i]);
    setAttempted(newAttempted);
    const firstInvalid = TAB_ORDER.slice(currentIndex, targetIndex).find((t) => errorForTab(t));
    setActiveTab(firstInvalid ?? tab);
  }

  // ── Landing data ──────────────────────────────────────────────────────────
  const landingData: LandingData = {
    title,
    bio: isLinkhub ? bio : undefined,
    avatar: isLinkhub ? avatar : undefined,
    links: isLinkhub ? links : undefined,
    theme: isLinkhub
      ? {
          accentColor: theme.accentColor,
          bgTheme: theme.bgTheme,
          bgColor: theme.bgColor,
          bgPattern: theme.bgPattern,
          patternOpacity: theme.patternOpacity,
          patternAnimated: theme.patternAnimated,
          cardColor: theme.cardColor,
          buttonStyle,
          buttonBorderColor: theme.buttonBorderColor,
          buttonBgColor: theme.buttonBgColor,
          buttonTextColor: theme.buttonTextColor,
        }
      : undefined,
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    // Mark all tabs as attempted so all errors surface
    setAttempted(new Set(TAB_ORDER));
    if (isLinkhub && (!profileValid || !linksValid)) {
      // Navigate to first invalid tab
      const first = TAB_ORDER.find((tab) => errorForTab(tab));
      if (first) setActiveTab(first);
      return;
    }
    setSaving(true);
    try {
      const cleanLinks = links.filter((l) => l.url && l.url.trim() !== "");
      const cleanLandingData: LandingData = stripUndefined({
        title,
        bio: isLinkhub ? bio : undefined,
        avatar: isLinkhub ? avatar : undefined,
        links: isLinkhub ? cleanLinks : undefined,
        theme: isLinkhub
          ? {
              accentColor: theme.accentColor,
              bgTheme: theme.bgTheme,
              bgColor: theme.bgColor,
              bgPattern: theme.bgPattern,
              patternOpacity: theme.patternOpacity,
              patternAnimated: theme.patternAnimated,
              cardColor: theme.cardColor,
              buttonStyle,
              buttonBorderColor: theme.buttonBorderColor,
              buttonBgColor: theme.buttonBgColor,
              buttonTextColor: theme.buttonTextColor,
            }
          : undefined,
      });
      await onSave(stripUndefined({
        targetUrl,
        title,
        mode,
        redirectDelay: mode === "redirect" ? redirectDelay : 0,
        landingData: cleanLandingData,
      }));
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  function handleThemeChange(t: Theme) {
    const { buttonStyle: bs, ...rest } = t;
    setTheme(rest);
    if (bs) setButtonStyle(bs);
  }

  // ── Buttons ───────────────────────────────────────────────────────────────
  const saveBtn = (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="w-full rounded-xl bg-beni py-3 text-sm font-medium text-white transition-colors hover:bg-beni/90 disabled:opacity-60"
    >
      {saving ? t("saving") : saveLabel ?? t("save")}
    </button>
  );

  const isLastTab  = activeTab === TAB_ORDER[TAB_ORDER.length - 1];
  const currentErr = attempted.has(activeTab) ? errorForTab(activeTab) : null;

  const wizardNextBtn = (
    <div className="space-y-2">
      {currentErr && (
        <p className="text-center text-xs text-shu">{currentErr}</p>
      )}
      {isLastTab ? saveBtn : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-xl bg-beni py-3 text-sm font-medium text-white transition-colors hover:bg-beni/90"
        >
          {t("next")} →
        </button>
      )}
    </div>
  );

  const actionBtn = wizard ? wizardNextBtn : saveBtn;

  // ── Redirect mode ─────────────────────────────────────────────────────────
  if (!isLinkhub) {
    return (
      <div className="flex flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-lg space-y-6">
          <BasicInfo
            mode={mode}
            title={title}
            bio=""
            targetUrl={targetUrl}
            onTitleChange={setTitle}
            onBioChange={() => {}}
            onTargetUrlChange={setTargetUrl}
          />
          <RedirectOptions delay={redirectDelay} onDelayChange={setRedirectDelay} />
          <div className="border-t border-hai/30 pt-5">{saveBtn}</div>
        </div>
      </div>
    );
  }

  // ── Linkhub mode ──────────────────────────────────────────────────────────
  const tabPanelProps = {
    activeTab,
    onTabChange: handleTabChange,
    wizard,
    tabValidity: { profile: profileValid, links: linksValid, design: true },
    tabAttempted: attempted,
    title,
    bio,
    avatar,
    links,
    theme: { ...theme, buttonStyle },
    onTitleChange: setTitle,
    onBioChange: setBio,
    onAvatarChange: setAvatar,
    onLinksChange: setLinks,
    onThemeChange: handleThemeChange,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">

      {/* ── MOBILE: editor view ── */}
      <div className={`flex min-h-0 flex-1 flex-col lg:hidden ${mobileView === "preview" ? "hidden" : ""}`}>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ paddingBottom: "calc(56px + max(8px, env(safe-area-inset-bottom)))" }}>
          <EditorTabPanel {...tabPanelProps} hideTabBar />
          <div className="px-4 pb-4 pt-2">
            {actionBtn}
          </div>
        </div>
      </div>

      {/* ── MOBILE: preview view ── */}
      {mobileView === "preview" && (
        <div className="flex flex-1 flex-col lg:hidden" style={{ paddingBottom: "calc(64px + max(8px, env(safe-area-inset-bottom)))" }}>
          <MobilePreviewView
            data={landingData}
            onBack={() => setMobileView("editor")}
          />
        </div>
      )}

      {/* ── MOBILE: bottom tab bar ── */}
      <MobileTabBar
        view={mobileView}
        activeTab={activeTab}
        wizard={wizard}
        tabValidity={{ profile: profileValid, links: linksValid, design: true }}
        tabAttempted={attempted}
        onViewChange={setMobileView}
        onTabChange={(tab) => {
          handleTabChange(tab);
          setMobileView("editor");
        }}
      />

      {/* ── DESKTOP: editor column ── */}
      <div className="hidden lg:flex lg:w-[40%] lg:flex-col lg:overflow-hidden lg:border-r lg:border-hai/30">
        <div className="flex-1 overflow-y-auto">
          <EditorTabPanel {...tabPanelProps} />
        </div>
        <div className="border-t border-hai/30 px-5 py-4">
          {actionBtn}
        </div>
      </div>

      {/* ── DESKTOP: preview column ── */}
      <div className="hidden lg:flex lg:w-[60%] lg:flex-col lg:overflow-hidden">
        <PreviewPanel data={landingData} />
      </div>

    </div>
  );
}
