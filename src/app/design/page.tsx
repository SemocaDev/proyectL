"use client";

import { useState } from "react";
import { WagaraPattern } from "@/components/patterns";
import { colors } from "@/lib/css-vars";
import type { PatternType } from "@/components/patterns";

const ALL_PATTERNS: PatternType[] = [
  "seigaiha",
  "asanoha",
  "shippo",
  "ichimatsu",
  "ryusuimon",
  "tokusa",
  "uroko",
  "kikko",
  "karakusa",
];

const PATTERN_INFO: Record<PatternType, { jp: string; meaning: string; anim: string }> = {
  seigaiha:  { jp: "青海波", meaning: "Paz, continuidad, buena fortuna", anim: "drift-x" },
  asanoha:   { jp: "麻の葉", meaning: "Crecimiento rápido y sano", anim: "breathe" },
  shippo:    { jp: "七宝",   meaning: "Armonía, relaciones, riqueza espiritual", anim: "drift-xy" },
  ichimatsu: { jp: "市松",   meaning: "Continuidad, prosperidad", anim: "none" },
  ryusuimon: { jp: "流水紋", meaning: "Flujo de agua, información fluida", anim: "drift-x" },
  tokusa:    { jp: "十草",   meaning: "Prosperidad, pulido, brillo", anim: "drift-y" },
  uroko:     { jp: "鱗",     meaning: "Protección, alejar la mala suerte", anim: "drift-y" },
  kikko:     { jp: "亀甲",   meaning: "Longevidad, estabilidad", anim: "breathe" },
  karakusa:  { jp: "唐草",   meaning: "Prosperidad y vida que se expande", anim: "drift-xy" },
};

const COLOR_PALETTE = [
  { name: "Shironeri", var: "bg-shironeri", hex: colors.shironeri, label: "Fondo principal" },
  { name: "Sumi",      var: "bg-sumi",      hex: colors.sumi,      label: "Texto principal" },
  { name: "Ginnezumi", var: "bg-ginnezumi", hex: colors.ginnezumi, label: "Texto secundario" },
  { name: "Hai",       var: "bg-hai",       hex: colors.hai,       label: "Bordes, divisores" },
  { name: "Beni",      var: "bg-beni",      hex: colors.beni,      label: "Acento principal" },
  { name: "Shu",       var: "bg-shu",       hex: colors.shu,       label: "Acento cálido" },
  { name: "Ai",        var: "bg-ai",        hex: colors.ai,        label: "Acento índigo" },
  { name: "Uguisu",    var: "bg-uguisu",    hex: colors.uguisu,    label: "Éxito, verificado" },
];

export default function DesignPage() {
  const [selectedPattern, setSelectedPattern] = useState<PatternType>("seigaiha");
  const [opacity, setOpacity] = useState(0.12);
  const [color, setColor] = useState<string>(colors.beni);
  const [isStatic, setIsStatic] = useState(false);
  const [bgColor, setBgColor] = useState<string>(colors.shironeri);

  return (
    <div className="min-h-screen bg-shironeri font-sans">
      {/* Header */}
      <div className="border-b border-hai/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-light text-sumi">Design System</h1>
            <p className="text-xs text-ginnezumi">DevMinds Links — Wagara Patterns & Palette</p>
          </div>
          <span className="rounded border border-hai px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ginnezumi">
            Debug
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-10">

        {/* ── Pattern Preview ── */}
        <section className="space-y-4">
          <SectionTitle>Patrones Wagara</SectionTitle>

          {/* Live Preview */}
          <div
            className="relative h-56 overflow-hidden rounded-2xl border border-hai/60 sm:h-72"
            style={{ background: bgColor }}
          >
            <WagaraPattern
              pattern={selectedPattern}
              color={color}
              opacity={opacity}
              static={isStatic}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center">
              <p className="text-2xl font-light" style={{ color: colors.sumi }}>
                {PATTERN_INFO[selectedPattern].jp}
              </p>
              <p className="text-sm" style={{ color: colors.ginnezumi }}>
                {selectedPattern} · opacity {opacity.toFixed(2)}
              </p>
              <p className="text-xs" style={{ color: colors.ginnezumi, opacity: 0.6 }}>
                {PATTERN_INFO[selectedPattern].meaning}
              </p>
            </div>
          </div>

          {/* Pattern selector */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
            {ALL_PATTERNS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPattern(p)}
                className={`relative h-16 overflow-hidden rounded-xl border text-center transition-all ${
                  selectedPattern === p
                    ? "border-beni ring-1 ring-beni"
                    : "border-hai hover:border-ginnezumi/40"
                }`}
                style={{ background: bgColor }}
              >
                <WagaraPattern pattern={p} color={color} opacity={opacity} static />
                <span
                  className="relative z-10 text-[9px] font-medium"
                  style={{ color: colors.sumi }}
                >
                  {p}
                </span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-hai/60 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <Control label="Opacidad">
              <input
                type="range" min={0.01} max={0.5} step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-beni"
              />
              <div className="flex justify-between text-[10px] text-ginnezumi/50">
                <span>0.01</span><span>{opacity.toFixed(2)}</span><span>0.5</span>
              </div>
            </Control>

            <Control label="Color del patrón">
              <div className="flex items-center gap-3">
                <input
                  type="color" value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-hai"
                />
                <span className="font-mono text-xs text-ginnezumi">{color}</span>
              </div>
            </Control>

            <Control label="Color de fondo">
              <div className="flex items-center gap-3">
                <input
                  type="color" value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-hai"
                />
                <span className="font-mono text-xs text-ginnezumi">{bgColor}</span>
              </div>
            </Control>

            <Control label="Animación">
              <button
                onClick={() => setIsStatic((s) => !s)}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  isStatic
                    ? "border-hai bg-white text-ginnezumi"
                    : "border-beni bg-beni/5 text-beni"
                }`}
              >
                {isStatic ? "Estático (off)" : "Animado (on)"}
              </button>
              <p className="text-[10px] text-ginnezumi/50">
                anim: {PATTERN_INFO[selectedPattern].anim}
              </p>
            </Control>
          </div>
        </section>

        {/* ── All patterns grid ── */}
        <section className="space-y-4">
          <SectionTitle>Todos los patrones (comparativa)</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
            {ALL_PATTERNS.map((p) => (
              <div key={p} className="space-y-1.5">
                <div
                  className="relative h-32 overflow-hidden rounded-xl border border-hai/60"
                  style={{ background: bgColor }}
                >
                  <WagaraPattern pattern={p} color={color} opacity={opacity} static />
                  <div className="absolute inset-0 flex flex-col items-end justify-end p-2.5">
                    <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-sumi backdrop-blur-sm">
                      {p}
                    </span>
                  </div>
                </div>
                <div className="px-0.5">
                  <p className="text-[11px] font-medium text-sumi">{PATTERN_INFO[p].jp}</p>
                  <p className="text-[10px] text-ginnezumi/60">{PATTERN_INFO[p].meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Color Palette ── */}
        <section className="space-y-4">
          <SectionTitle>Paleta de colores</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COLOR_PALETTE.map((c) => (
              <div key={c.name} className="space-y-2">
                <div
                  className="h-16 rounded-xl border border-hai/40"
                  style={{ background: c.hex }}
                />
                <div>
                  <p className="text-xs font-medium text-sumi">{c.name}</p>
                  <p className="font-mono text-[10px] text-ginnezumi">{c.hex}</p>
                  <p className="text-[10px] text-ginnezumi/60">{c.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="space-y-4">
          <SectionTitle>Tipografía</SectionTitle>
          <div className="rounded-2xl border border-hai/60 bg-white p-6 space-y-4">
            <p className="text-4xl font-light text-sumi">DevMinds Links</p>
            <p className="text-2xl font-light text-sumi">Acortador de URLs</p>
            <p className="text-lg font-light text-ginnezumi">Texto secundario, descripción</p>
            <p className="text-sm text-ginnezumi">Cuerpo de texto normal — lectura cómoda</p>
            <p className="text-xs text-ginnezumi/60">Texto auxiliar, metadatos, fechas</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded bg-beni px-3 py-1.5 text-xs font-medium text-white">Botón primario</span>
              <span className="rounded border border-hai px-3 py-1.5 text-xs font-medium text-sumi">Botón secundario</span>
              <span className="rounded bg-uguisu/10 px-3 py-1.5 text-xs font-medium text-uguisu">Éxito</span>
              <span className="rounded bg-ai/10 px-3 py-1.5 text-xs font-medium text-ai">Info</span>
              <span className="text-xs font-medium uppercase tracking-wider text-ginnezumi">LABEL SECCIÓN</span>
            </div>
          </div>
        </section>

        {/* ── Pattern + Text combinations ── */}
        <section className="space-y-4">
          <SectionTitle>Combinaciones patrón + contenido</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(["seigaiha", "asanoha", "kikko"] as PatternType[]).map((p) => (
              <div
                key={p}
                className="relative overflow-hidden rounded-2xl border border-hai/60 bg-shironeri px-6 py-8 text-center"
              >
                <WagaraPattern pattern={p} color={colors.beni} opacity={0.08} />
                <div className="relative z-10 space-y-2">
                  <div className="mx-auto h-px w-8 bg-beni" />
                  <p className="text-xl font-light text-sumi">{PATTERN_INFO[p].jp}</p>
                  <p className="text-xs text-ginnezumi">{PATTERN_INFO[p].meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-hai/60" />
      <h2 className="text-xs font-medium uppercase tracking-widest text-ginnezumi">
        {children}
      </h2>
      <span className="h-px flex-1 bg-hai/60" />
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-ginnezumi">{label}</p>
      {children}
    </div>
  );
}
