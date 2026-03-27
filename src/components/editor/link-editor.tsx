"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BasicInfo } from "./sections/basic-info";
import { LinksSection } from "./sections/links-section";
import { ThemeSection } from "./sections/theme-section";
import { ButtonStylePicker } from "./sections/button-style-picker";
import { RedirectOptions } from "./sections/redirect-options";
import { PreviewPanel } from "./preview-panel";
import { PreviewModal } from "./preview-modal";
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
}

export function LinkEditor({ mode, initial, onSave, saveLabel }: LinkEditorProps) {
  const t = useTranslations("editor");

  // State
  const [targetUrl, setTargetUrl] = useState(initial?.targetUrl ?? "");
  const [title, setTitle] = useState(initial?.title ?? initial?.landingData?.title ?? "");
  const [bio, setBio] = useState(initial?.landingData?.bio ?? "");
  const [links, setLinks] = useState<LinkhubLinkItem[]>(
    initial?.landingData?.links ?? []
  );
  const [theme, setTheme] = useState<Theme>(
    initial?.landingData?.theme ?? {}
  );
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(
    initial?.landingData?.theme?.buttonStyle ?? { shape: "rounded", variant: "filled" }
  );
  const [redirectDelay, setRedirectDelay] = useState(initial?.redirectDelay ?? 0);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Computed landing data for preview
  const landingData: LandingData = {
    title,
    bio: mode === "linkhub" ? bio : undefined,
    links: mode === "linkhub" ? links : undefined,
    theme:
      mode === "linkhub"
        ? { ...theme, buttonStyle }
        : undefined,
  };

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        targetUrl,
        title,
        mode,
        redirectDelay: mode === "redirect" ? redirectDelay : 0,
        landingData,
      });
    } finally {
      setSaving(false);
    }
  }

  const isLinkhub = mode === "linkhub";

  const editorContent = (
    <div className="space-y-6">
      {/* Basic info */}
      <BasicInfo
        mode={mode}
        title={title}
        bio={bio}
        targetUrl={targetUrl}
        onTitleChange={setTitle}
        onBioChange={setBio}
        onTargetUrlChange={setTargetUrl}
      />

      {/* Redirect options */}
      {mode === "redirect" && (
        <RedirectOptions
          delay={redirectDelay}
          onDelayChange={setRedirectDelay}
        />
      )}

      {/* Links section — linkhub only */}
      {isLinkhub && (
        <LinksSection links={links} onChange={setLinks} />
      )}

      {/* Theme — linkhub only */}
      {isLinkhub && (
        <>
          <ThemeSection
            theme={{ ...theme, buttonStyle }}
            onChange={(t) => {
              const { buttonStyle: bs, ...rest } = t;
              setTheme(rest);
              if (bs) setButtonStyle(bs);
            }}
          />
          <ButtonStylePicker
            style={buttonStyle}
            onChange={setButtonStyle}
          />
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 border-t border-hai/30 pt-5">
        {/* Mobile preview button */}
        {isLinkhub && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-lg border border-hai px-4 py-2.5 text-sm text-ginnezumi transition-colors hover:border-sumi hover:text-sumi lg:hidden"
          >
            {t("preview")}
          </button>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-lg bg-beni py-2.5 text-sm font-medium text-white transition-colors hover:bg-beni/90 disabled:opacity-60"
        >
          {saving ? "..." : saveLabel ?? t("save")}
        </button>
      </div>
    </div>
  );

  // Redirect mode: centered single-column layout
  if (!isLinkhub) {
    return (
      <div className="flex flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-lg">
          {editorContent}
        </div>
      </div>
    );
  }

  // Linkhub mode: split layout with preview
  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
      {/* Editor panel — left, 42%, independent scroll */}
      <div className="w-full overflow-y-auto px-4 py-6 sm:px-6 lg:w-[42%] lg:border-r lg:border-hai/30 lg:py-8">
        {editorContent}
      </div>

      {/* Preview panel — right 58%, independent scroll, desktop only */}
      <div className="hidden overflow-y-auto bg-hai/20 lg:flex lg:w-[58%] lg:items-start lg:justify-center lg:px-8 lg:py-8">
        <PreviewPanel data={landingData} />
      </div>

      {/* Preview modal — mobile only */}
      <PreviewModal
        data={landingData}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
