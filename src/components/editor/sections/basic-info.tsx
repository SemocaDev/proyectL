"use client";

import { useTranslations } from "next-intl";

interface BasicInfoProps {
  mode: "redirect" | "linkhub";
  title: string;
  bio: string;
  targetUrl: string;
  onTitleChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onTargetUrlChange: (v: string) => void;
}

export function BasicInfo({
  mode,
  title,
  bio,
  targetUrl,
  onTitleChange,
  onBioChange,
  onTargetUrlChange,
}: BasicInfoProps) {
  const t = useTranslations("editor");

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("basicInfo")}
      </h3>

      {/* Target URL — solo redirect */}
      {mode === "redirect" && (
        <div className="space-y-1.5">
          <label className="text-xs text-ginnezumi">{t("targetUrl")}</label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => onTargetUrlChange(e.target.value)}
            className="w-full rounded-lg border border-hai bg-white px-3 py-2.5 text-sm text-sumi focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Título */}
      <div className="space-y-1.5">
        <label className="text-xs text-ginnezumi">{t("title")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          className="w-full rounded-lg border border-hai bg-white px-3 py-2.5 text-sm text-sumi focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
          placeholder={t("titlePlaceholder")}
        />
      </div>

      {/* Bio — solo linkhub */}
      {mode === "linkhub" && (
        <div className="space-y-1.5">
          <label className="text-xs text-ginnezumi">{t("bio")}</label>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full resize-none rounded-lg border border-hai bg-white px-3 py-2.5 text-sm text-sumi focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
            placeholder={t("bioPlaceholder")}
          />
          <p className="text-right text-[11px] text-ginnezumi/50">
            {bio.length}/300
          </p>
        </div>
      )}
    </section>
  );
}
