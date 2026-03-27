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
          <label className="block text-xs font-medium text-ginnezumi">
            {t("targetUrl")}
          </label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => onTargetUrlChange(e.target.value)}
            className="w-full rounded-xl border border-hai bg-white px-4 py-3 text-sm text-sumi placeholder-ginnezumi/40 focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
            placeholder="https://..."
            autoFocus
          />
        </div>
      )}

      {/* Título */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-ginnezumi">
          {t("title")}
          {mode === "redirect" && (
            <span className="ml-1 font-normal text-ginnezumi/50">({t("optional")})</span>
          )}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={100}
          className="w-full rounded-xl border border-hai bg-white px-4 py-3 text-sm text-sumi placeholder-ginnezumi/40 focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
          placeholder={t("titlePlaceholder")}
        />
      </div>

      {/* Bio — solo linkhub */}
      {mode === "linkhub" && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-ginnezumi">{t("bio")}</label>
            <span className="text-[11px] text-ginnezumi/40">{bio.length}/300</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full resize-none rounded-xl border border-hai bg-white px-4 py-3 text-sm text-sumi placeholder-ginnezumi/40 focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni"
            placeholder={t("bioPlaceholder")}
          />
        </div>
      )}
    </section>
  );
}
