"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface AvatarPickerProps {
  value: string | undefined;
  onChange: (emoji: string | undefined) => void;
}

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

const EMOJI_CATEGORIES = [
  {
    label: "Personas",
    emojis: ["👤", "👩", "👨", "🧑", "👶", "🧓"],
  },
  {
    label: "Arte & Música",
    emojis: ["🎸", "🎹", "🎤", "🎨", "📷", "🎭"],
  },
  {
    label: "Tech",
    emojis: ["💻", "📱", "🤖", "⚡", "🔬", "🌐"],
  },
  {
    label: "Naturaleza",
    emojis: ["🌸", "🌿", "🌊", "🌙", "☀️", "🔥"],
  },
  {
    label: "Misc",
    emojis: ["✨", "💎", "🚀", "🎯", "💡", "❤️"],
  },
];

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const t = useTranslations("editor");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="self-start text-xs font-medium uppercase tracking-wider text-ginnezumi">
        {t("avatar")}
      </p>

      {/* Trigger — avatar display */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all ${
          value
            ? "border-hai bg-hai/20 hover:border-beni/50"
            : "border-dashed border-hai bg-shironeri hover:border-beni/50"
        }`}
        title={t("chooseAvatar")}
      >
        {value ? (
          <span className="text-5xl leading-none" style={{ fontFamily: EMOJI_FONT }}>
            {value}
          </span>
        ) : (
          <span className="text-2xl text-ginnezumi/30">+</span>
        )}
      </button>

      <p className="text-xs text-ginnezumi/50">{t("chooseAvatar")}</p>

      {/* Picker panel */}
      {open && (
        <div
          ref={containerRef}
          className="w-full rounded-2xl border border-hai/60 bg-white shadow-lg"
        >
          {/* Clear option */}
          <div className="border-b border-hai/30 px-4 py-3">
            <button
              type="button"
              onClick={() => { onChange(undefined); setOpen(false); }}
              className="flex items-center gap-2 text-xs text-ginnezumi/60 transition-colors hover:text-shu"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-hai text-base">✕</span>
              {t("clearAvatar")}
            </button>
          </div>

          {/* Emoji grid */}
          <div className="px-4 py-3 space-y-3" style={{ fontFamily: EMOJI_FONT }}>
            {EMOJI_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ginnezumi/40">
                  {cat.label}
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => { onChange(emoji); setOpen(false); }}
                      className={`flex h-10 w-full items-center justify-center rounded-lg text-2xl transition-all hover:scale-110 hover:bg-shironeri ${
                        value === emoji ? "bg-beni/10 ring-1 ring-beni" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
