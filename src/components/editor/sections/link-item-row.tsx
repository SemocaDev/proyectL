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
    <div className="rounded-lg border border-hai bg-white p-3 transition-colors hover:border-sumi/20">
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

      {/* Bottom row: reorder + delete */}
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
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-ginnezumi/40 transition-colors hover:bg-shu/5 hover:text-shu"
          title={t("removeLink")}
        >
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{t("removeLink")}</span>
        </button>
      </div>
    </div>
  );
}
