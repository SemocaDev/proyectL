"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { colors } from "@/lib/css-vars";

interface CountdownPageProps {
  title: string | null;
  creatorName: string | null;
  targetUrl: string;
  delay: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// viewBox="-200 -200 400 400" — origin (0,0) is the visual center.
// CSS transform-origin on SVG elements uses the SVG coordinate system when
// the element has `transform-box: fill-box` NOT set — we want the viewport
// origin, so we use plain `transform-origin: 0px 0px` with no transform-box.
// ─────────────────────────────────────────────────────────────────────────────

function buildSeigaiha(r: number, n: number, scaleR: number): React.ReactNode[] {
  const items: React.ReactNode[] = [];
  for (let j = 0; j < n; j++) {
    const angle = (j / n) * 2 * Math.PI;
    const x = +(r * Math.cos(angle)).toFixed(3);
    const y = +(r * Math.sin(angle)).toFixed(3);
    items.push(
      <circle key={`o${j}`} cx={x} cy={y} r={+scaleR.toFixed(3)} fill="none" />,
      <circle key={`i${j}`} cx={x} cy={y} r={+(scaleR * 0.52).toFixed(3)} fill="none" opacity={0.5} />,
    );
  }
  return items;
}

function buildRyusuimon(r: number, n: number, arcR: number): React.ReactNode[] {
  return Array.from({ length: n }, (_, j) => {
    const angle = (j / n) * 2 * Math.PI;
    const x = +(r * Math.cos(angle)).toFixed(3);
    const y = +(r * Math.sin(angle)).toFixed(3);
    const sz = +arcR.toFixed(3);
    return (
      <path key={j}
        d={`M ${+(x - sz).toFixed(3)} ${y} A ${sz} ${sz} 0 0 1 ${+(x + sz).toFixed(3)} ${y}`}
        fill="none" />
    );
  });
}

function buildKikko(r: number, n: number, sz: number): React.ReactNode[] {
  return Array.from({ length: n }, (_, j) => {
    const angle = (j / n) * 2 * Math.PI;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (k / 6) * 2 * Math.PI + Math.PI / 6;
      return `${(x + sz * Math.cos(a)).toFixed(3)},${(y + sz * Math.sin(a)).toFixed(3)}`;
    }).join(" ");
    return <polygon key={j} points={pts} fill="none" />;
  });
}

// Pre-build at module load — identical on server and client, no float divergence
const SEIGAIHA_DATA = [
  { r: 168, n: 18, scaleR: 17.5, dur: 80, rev: false, color: colors.beni,  sw: 1.3, op: 0.14 },
  { r: 148, n: 16, scaleR: 14.5, dur: 65, rev: true,  color: colors.sumi,  sw: 1.1, op: 0.18 },
  { r: 128, n: 14, scaleR: 12.5, dur: 52, rev: false, color: colors.beni,  sw: 1.2, op: 0.22 },
  { r: 108, n: 12, scaleR: 10.5, dur: 41, rev: true,  color: colors.sumi,  sw: 1.0, op: 0.26 },
  { r: 89,  n: 10, scaleR: 8.8,  dur: 32, rev: false, color: colors.beni,  sw: 1.1, op: 0.31 },
  { r: 71,  n: 8,  scaleR: 7.2,  dur: 24, rev: true,  color: colors.ai,    sw: 1.0, op: 0.37 },
  { r: 54,  n: 7,  scaleR: 5.8,  dur: 17, rev: false, color: colors.sumi,  sw: 0.9, op: 0.43 },
  { r: 38,  n: 5,  scaleR: 4.8,  dur: 11, rev: true,  color: colors.beni,  sw: 0.9, op: 0.51 },
] as const;

const RYUSUIMON_DATA = [
  { r: 158, n: 12, arcR: 8.5, dur: 70, rev: true,  color: colors.ai,  sw: 0.8, op: 0.10 },
  { r: 118, n: 10, arcR: 7.0, dur: 46, rev: false, color: colors.ai,  sw: 0.8, op: 0.13 },
  { r: 79,  n: 8,  arcR: 5.5, dur: 28, rev: true,  color: colors.ai,  sw: 0.7, op: 0.16 },
] as const;

const KIKKO_DATA = [
  { r: 138, n: 11, sz: 6.8, dur: 58, rev: false, color: colors.sumi, sw: 0.7, op: 0.10 },
  { r: 98,  n: 9,  sz: 5.5, dur: 37, rev: true,  color: colors.sumi, sw: 0.7, op: 0.13 },
] as const;

const SEIGAIHA_ITEMS  = SEIGAIHA_DATA.map((d)  => buildSeigaiha(d.r, d.n, d.scaleR));
const RYUSUIMON_ITEMS = RYUSUIMON_DATA.map((d) => buildRyusuimon(d.r, d.n, d.arcR));
const KIKKO_ITEMS     = KIKKO_DATA.map((d)     => buildKikko(d.r, d.n, d.sz));

// Unique keyframe names are injected once via a <style> tag
const KEYFRAMES = `
  @keyframes vortex-cw  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
  @keyframes vortex-ccw { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
`;

function rotStyle(dur: number, rev: boolean): React.CSSProperties {
  return {
    transformOrigin: "0px 0px",
    animation: `${rev ? "vortex-ccw" : "vortex-cw"} ${dur}s linear infinite`,
  };
}

function VortexRings({ isCollapsing, speedMult, size = 680 }: { isCollapsing: boolean; speedMult: number; size?: number }) {
  return (
    <motion.svg
      width={size} height={size}
      viewBox="-200 -200 400 400"
      fill="none" aria-hidden="true" overflow="visible"
      initial={{ scale: 1, opacity: 1 }}
      animate={isCollapsing ? { scale: 0.04, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={isCollapsing ? { duration: 0.75, ease: [0.4, 0, 1, 1] } : { duration: 0.5 }}
    >
      <style>{KEYFRAMES}</style>

      <defs>
        <radialGradient id="vg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={colors.beni} stopOpacity="0.08" />
          <stop offset="60%"  stopColor={colors.ai}   stopOpacity="0.04" />
          <stop offset="100%" stopColor={colors.sumi} stopOpacity="0.12" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="195" fill="url(#vg)" />

      {/* Kikko */}
      {KIKKO_DATA.map((d, i) => (
        <g key={`k${i}`} stroke={d.color} strokeWidth={d.sw} opacity={d.op}
           style={rotStyle(d.dur / speedMult, d.rev)}>
          {KIKKO_ITEMS[i]}
        </g>
      ))}

      {/* Ryusuimon */}
      {RYUSUIMON_DATA.map((d, i) => (
        <g key={`r${i}`} stroke={d.color} strokeWidth={d.sw} opacity={d.op}
           style={rotStyle(d.dur / speedMult, d.rev)}>
          {RYUSUIMON_ITEMS[i]}
        </g>
      ))}

      {/* Seigaiha — dominant wave layer */}
      {SEIGAIHA_DATA.map((d, i) => (
        <g key={`s${i}`} stroke={d.color} strokeWidth={d.sw} opacity={d.op}
           style={rotStyle(d.dur / speedMult, d.rev)}>
          {SEIGAIHA_ITEMS[i]}
        </g>
      ))}

      {/* Dashed accent rings */}
      {([
        { r: 160, n: 24, dur: 90,  rev: false, c: colors.beni, op: 0.08 },
        { r: 140, n: 20, dur: 74,  rev: true,  c: colors.sumi, op: 0.09 },
        { r: 120, n: 18, dur: 58,  rev: false, c: colors.ai,   op: 0.09 },
        { r: 100, n: 15, dur: 44,  rev: true,  c: colors.beni, op: 0.10 },
        { r: 81,  n: 12, dur: 32,  rev: false, c: colors.sumi, op: 0.11 },
        { r: 62,  n: 10, dur: 22,  rev: true,  c: colors.ai,   op: 0.12 },
        { r: 46,  n: 8,  dur: 14,  rev: false, c: colors.beni, op: 0.13 },
      ] as const).map((d, i) => {
        const circ = 2 * Math.PI * d.r;
        const dash = circ / d.n;
        return (
          <circle key={`d${i}`}
            cx="0" cy="0" r={d.r}
            stroke={d.c} strokeWidth="0.6"
            strokeDasharray={`${(dash * 0.5).toFixed(3)} ${(dash * 0.5).toFixed(3)}`}
            opacity={d.op} strokeLinecap="round"
            style={rotStyle(d.dur / speedMult, d.rev)}
          />
        );
      })}

      {/* Center glow */}
      <motion.circle cx="0" cy="0" r="20" fill={colors.beni} opacity={0.15}
        animate={{
          r:       isCollapsing ? [20, 10, 26]          : [20, 26, 20],
          opacity: isCollapsing ? [0.15, 0.45, 0]       : [0.15, 0.22, 0.15],
        }}
        transition={{ duration: isCollapsing ? 0.4 : 3.5, repeat: isCollapsing ? 0 : Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function CountdownPage({ title, creatorName, targetUrl, delay }: CountdownPageProps) {
  const t = useTranslations("countdown");
  const reduced = useReducedMotion();
  const [remaining, setRemaining] = useState(delay);
  const [phase, setPhase] = useState<"counting" | "collapsing" | "done">("counting");
  const [mounted, setMounted] = useState(false);

  const startRef = useRef<number | null>(null);
  const [lightness, setLightness] = useState(97);
  const rafRef = useRef<number>(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || delay === 0 || phase !== "counting") return;
    const totalMs = delay * 1000;
    startRef.current = performance.now();
    function tick(now: number) {
      const elapsed = now - (startRef.current ?? now);
      const p = Math.min(elapsed / totalMs, 1);
      setLightness(97 - p * p * 69);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, delay, phase]);

  const doRedirect = useCallback(() => { window.location.href = targetUrl; }, [targetUrl]);

  useEffect(() => {
    if (phase !== "counting") return;
    if (remaining <= 0) { setPhase("collapsing"); return; }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, phase]);

  useEffect(() => {
    if (phase !== "collapsing") return;
    const timer = setTimeout(() => { setPhase("done"); doRedirect(); }, 1000);
    return () => clearTimeout(timer);
  }, [phase, doRedirect]);

  const isCollapsing = phase === "collapsing" || phase === "done";
  const speedMult = isCollapsing ? 7 : 1;
  const isDark  = lightness < 55;
  const bgColor = `hsl(28, 8%, ${Math.round(lightness)}%)`;
  const cardBg  = isDark ? "bg-white/10 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm";
  const cardBdr = isDark ? "border-white/20" : "border-white/70";
  const textPri = isDark ? "text-white/90" : "text-sumi";
  const textSec = isDark ? "text-white/55" : "text-ginnezumi";

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ backgroundColor: bgColor, transition: "background-color 0.8s ease" }}
    >
      {/* ── Vórtice — ocupa toda la pantalla, centrado ── */}
      {mounted && !reduced && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Desktop: larger SVG; mobile: smaller */}
          <div className="hidden sm:block">
            <VortexRings isCollapsing={isCollapsing} speedMult={speedMult} />
          </div>
          <div className="block sm:hidden">
            <VortexRings isCollapsing={isCollapsing} speedMult={speedMult} size={380} />
          </div>
        </div>
      )}

      {/* ── Contador en el centro visual absoluto del vórtice ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isCollapsing ? "done" : remaining}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`pointer-events-auto flex items-center justify-center rounded-full border-2 shadow-xl
              h-28 w-28 sm:h-40 sm:w-40 lg:h-52 lg:w-52
              ${cardBg} ${cardBdr}`}
          >
            <span className={`font-light tabular-nums
              text-5xl sm:text-7xl lg:text-8xl
              ${textPri}`}
            >
              {isCollapsing ? "↗" : remaining}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Info en la parte inferior ── */}
      <div className="relative z-10 mt-auto flex w-full flex-col items-center gap-3 px-4 pb-10 pt-4">
        {(title || creatorName) && (
          <div className="text-center space-y-0.5">
            {title && <h1 className={`text-lg font-light sm:text-xl ${textPri}`}>{title}</h1>}
            {creatorName && (
              <p className={`text-sm ${textSec}`}>
                {t("by")} <span className={`font-medium ${textPri}`}>@{creatorName}</span>
              </p>
            )}
          </div>
        )}

        <div className={`w-full max-w-sm rounded-xl border px-4 py-2.5 ${cardBg} ${cardBdr}`}>
          <p className={`mb-0.5 text-[10px] font-medium uppercase tracking-wider ${textSec}`}>
            {t("redirectingTo")}
          </p>
          <p className={`truncate text-sm ${textPri}`}>{targetUrl}</p>
        </div>

        <button
          onClick={doRedirect}
          disabled={isCollapsing}
          className={`w-full max-w-sm rounded-xl border py-3 text-sm shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-40 ${cardBg} ${cardBdr} ${textSec}`}
        >
          {isCollapsing ? "..." : t("goNow")}
        </button>

        <a href="https://l.devminds.online" className={`text-[10px] ${textSec}`}>
          Powered by DevMinds Links
        </a>
      </div>
    </div>
  );
}
