"use client";

import { useState } from "react";
import { PLATFORM_ICONS } from "@/lib/platform-icons";
import { useTranslations } from "next-intl";

interface IconPickerProps {
  value: string | undefined;
  onChange: (icon: string | undefined) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const t = useTranslations("editor");
  const [open, setOpen] = useState(false);

  const entries = Object.entries(PLATFORM_ICONS);
  const SelectedIcon = value ? PLATFORM_ICONS[value]?.svg : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
          value
            ? "border-beni/30 bg-beni/5 text-beni"
            : "border-hai bg-white text-ginnezumi hover:border-sumi/30"
        }`}
        title={t("pickIcon")}
      >
        {SelectedIcon ? (
          <SelectedIcon className="h-4 w-4" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute left-0 top-full z-50 mt-1 grid w-64 grid-cols-6 gap-1 rounded-lg border border-hai bg-white p-2 shadow-lg">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => { onChange(undefined); setOpen(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-dashed border-hai text-[10px] text-ginnezumi hover:bg-shironeri"
              title={t("noIcon")}
            >
              ✕
            </button>
            {entries.map(([key, { svg: Icon, label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setOpen(false); }}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                  value === key
                    ? "bg-beni/10 text-beni"
                    : "text-ginnezumi hover:bg-shironeri hover:text-sumi"
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
