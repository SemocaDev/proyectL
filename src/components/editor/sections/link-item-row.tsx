"use client";

import { IconPicker } from "./icon-picker";
import { useTranslations } from "next-intl";
import type { LinkhubLinkItem } from "@/lib/schemas";

interface LinkItemRowProps {
  item: LinkhubLinkItem;
  index: number;
  total: number;
  onChange: (item: LinkhubLinkItem) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function LinkItemRow({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: LinkItemRowProps) {
  const t = useTranslations("editor");

  return (
    <div className={`rounded-lg border p-3 transition-colors ${
      item.highlighted
        ? "border-beni/40 bg-beni/5"
        : "border-hai bg-white hover:border-sumi/20"
    }`}>
      {/* Top row: icon + fields */}
      <div className="flex items-start gap-2">
        {/* Icon picker */}
        <IconPicker
          value={item.icon}
          onChange={(icon) => onChange({ ...item, icon })}
        />

        {/* Fields */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => onChange({ ...item, label: e.target.value })}
            maxLength={50}
            className="w-full rounded-md border border-hai bg-shironeri px-2.5 py-1.5 text-sm text-sumi focus:border-beni focus:outline-none"
            placeholder={t("linkLabel")}
          />
          <input
            type="url"
            value={item.url}
            onChange={(e) => onChange({ ...item, url: e.target.value })}
            className="w-full rounded-md border border-hai bg-shironeri px-2.5 py-1.5 text-xs text-ginnezumi focus:border-beni focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Bottom row: reorder + highlight + delete */}
      <div className="mt-2 flex items-center justify-between border-t border-hai/30 pt-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-ginnezumi/60 transition-colors hover:bg-shironeri hover:text-sumi disabled:opacity-30"
            title={t("moveUp")}
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">{t("moveUp")}</span>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-ginnezumi/60 transition-colors hover:bg-shironeri hover:text-sumi disabled:opacity-30"
            title={t("moveDown")}
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">{t("moveDown")}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Highlight toggle */}
          <button
            type="button"
            onClick={() => onChange({ ...item, highlighted: !item.highlighted })}
            title={item.highlighted ? t("highlighted") : t("highlight")}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
              item.highlighted
                ? "text-beni hover:text-beni/70"
                : "text-ginnezumi/40 hover:text-ginnezumi"
            }`}
          >
            {item.highlighted ? (
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )}
            <span className="hidden sm:inline text-[10px]">{t("highlight")}</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-ginnezumi/40 transition-colors hover:bg-shu/5 hover:text-shu"
            title={t("removeLink")}
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">{t("removeLink")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
