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
  /** Called whenever the editor dirty state changes (for parent navigation guards) */
  onDirtyChange?: (dirty: boolean) => void;
}

export function LinkEditor({ mode, initial, onSave, saveLabel, onDirtyChange }: LinkEditorProps) {
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

  // ── Mobile navigation state ───────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [activeTab, setActiveTab] = useState<EditorTab>("profile");

  // ── Dirty tracking ──────────────────────────────────────────────────────
  const mounted = useRef(false);

  useEffect(() => {
    // Skip the initial render — only mark dirty after user interactions
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl, title, redirectDelay, bio, avatar, links, theme, buttonStyle]);

  // Notify parent of dirty state changes
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);

  // Unsaved changes guard
  useUnsavedChanges(dirty, tc("unsavedChanges"));

  // ── Computed landing data (live preview) ──────────────────────────────────
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

  async function handleSave() {
    setSaving(true);
    try {
      // Filter out incomplete links (missing URL) and strip undefined values
      // to prevent Next.js "$undefined" serialization issues in production
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

  // ── Redirect mode: single centered column ─────────────────────────────────
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

  // ── Linkhub mode: tab-based layout ───────────────────────────────────────
  const tabPanelProps = {
    activeTab,
    onTabChange: setActiveTab,
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
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ paddingBottom: "calc(64px + max(8px, env(safe-area-inset-bottom)))" }}>
          <EditorTabPanel {...tabPanelProps} hideTabBar />
          <div className="px-4 pb-4 pt-2">
            {saveBtn}
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

      {/* ── MOBILE: bottom tab bar (always visible in linkhub mode) ── */}
      <MobileTabBar
        view={mobileView}
        activeTab={activeTab}
        onViewChange={setMobileView}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileView("editor");
        }}
      />

      {/* ── DESKTOP: editor column (40%) ── */}
      <div className="hidden lg:flex lg:w-[40%] lg:flex-col lg:overflow-hidden lg:border-r lg:border-hai/30">
        <div className="flex-1 overflow-y-auto">
          <EditorTabPanel {...tabPanelProps} />
        </div>
        <div className="border-t border-hai/30 px-5 py-4">
          {saveBtn}
        </div>
      </div>

      {/* ── DESKTOP: preview column (60%) ── */}
      <div className="hidden lg:flex lg:w-[60%] lg:flex-col lg:overflow-hidden">
        <PreviewPanel data={landingData} />
      </div>

    </div>
  );
}
