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

          {/* Dropdown — fixed bottom sheet on mobile, absolute on desktop */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-hai bg-white p-3 shadow-2xl sm:absolute sm:bottom-auto sm:left-0 sm:right-auto sm:top-full sm:mt-1 sm:w-64 sm:rounded-lg sm:border sm:shadow-lg">
            {/* Mobile handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-hai sm:hidden" />

            <div className="grid grid-cols-6 gap-1 sm:grid-cols-6">
              {/* Clear option */}
              <button
                type="button"
                onClick={() => { onChange(undefined); setOpen(false); }}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-hai text-[10px] text-ginnezumi hover:bg-shironeri sm:h-9 sm:w-9"
                title={t("noIcon")}
              >
                ✕
              </button>
              {entries.map(([key, { svg: Icon, label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { onChange(key); setOpen(false); }}
                  className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors sm:h-9 sm:w-9 ${
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
          </div>
        </>
      )}
    </div>
  );
}
