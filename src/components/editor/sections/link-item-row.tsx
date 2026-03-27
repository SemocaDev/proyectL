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
    <div className="group rounded-lg border border-hai bg-white p-3 transition-colors hover:border-sumi/20">
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

        {/* Actions */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-1 text-ginnezumi/40 transition-colors hover:text-sumi disabled:opacity-20"
            title={t("moveUp")}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded p-1 text-ginnezumi/40 transition-colors hover:text-sumi disabled:opacity-20"
            title={t("moveDown")}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-ginnezumi/30 transition-colors hover:text-shu"
            title={t("removeLink")}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
