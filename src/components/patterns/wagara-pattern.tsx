"use client";

import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";

export type PatternType =
  | "seigaiha"
  | "asanoha"
  | "shippo"
  | "ichimatsu"
  | "ryusuimon"
  | "tokusa"
  | "uroko"
  | "kikko"
  | "karakusa";

interface PatternDef {
  viewBox: string;
  w: number;
  h: number;
  render: (stroke: string, fill: string) => React.ReactNode;
  /** Framer Motion animation applied to the inner SVG translate */
  anim?: "drift-x" | "drift-y" | "drift-xy" | "breathe" | "none";
}

function SeigaihaPaths({ stroke }: { stroke: string }) {
  return (
    <>
      {/* Row 0 */}
      <path d="M0 40 Q20 0 40 40" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M40 40 Q60 0 80 40" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M-40 40 Q-20 0 0 40" fill="none" stroke={stroke} strokeWidth="1.2" />
      {/* Inner arcs */}
      <path d="M8 40 Q20 8 32 40" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
      <path d="M48 40 Q60 8 72 40" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
      {/* Row 1 offset */}
      <path d="M20 80 Q40 40 60 80" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M-20 80 Q0 40 20 80" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M60 80 Q80 40 100 80" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M28 80 Q40 48 52 80" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
    </>
  );
}

function AsanohaPaths({ stroke }: { stroke: string }) {
  const cx = 30, cy = 30;
  // 6 spokes from center
  const spokes = [
    [cx, 0], [60, cy], [60, 60], [cx, 60], [0, cy], [0, 0],
  ];
  return (
    <>
      {spokes.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={stroke} strokeWidth="1" />
      ))}
      {/* Hexagonal outline */}
      <polygon
        points={`${cx},0 60,${cy} 60,${cy + 30} ${cx},60 0,${cy + 30} 0,${cy}`}
        fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.4"
      />
      <polygon
        points={`${cx},8 52,${cy} 52,${cy + 22} ${cx},52 8,${cy + 22} 8,${cy}`}
        fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3"
      />
    </>
  );
}

function ShippoPaths({ stroke }: { stroke: string }) {
  return (
    <>
      <circle cx="20" cy="20" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="60" cy="20" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="20" cy="60" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="60" cy="60" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      {/* Petal intersections */}
      <circle cx="0" cy="0" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="0" cy="40" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="40" cy="0" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
      <circle cx="40" cy="40" r="18" fill="none" stroke={stroke} strokeWidth="1.1" />
    </>
  );
}

function IchimatsuPaths({ fill }: { fill: string }) {
  return (
    <>
      <rect x="0" y="0" width="16" height="16" fill={fill} />
      <rect x="32" y="0" width="16" height="16" fill={fill} />
      <rect x="16" y="16" width="16" height="16" fill={fill} />
      <rect x="48" y="16" width="16" height="16" fill={fill} />
      <rect x="0" y="32" width="16" height="16" fill={fill} />
      <rect x="32" y="32" width="16" height="16" fill={fill} />
      <rect x="16" y="48" width="16" height="16" fill={fill} />
      <rect x="48" y="48" width="16" height="16" fill={fill} />
    </>
  );
}

function RyusuimonPaths({ stroke }: { stroke: string }) {
  return (
    <>
      <path d="M0 15 Q20 0 40 15 Q60 30 80 15 Q100 0 120 15" fill="none" stroke={stroke} strokeWidth="1.2" />
      <path d="M0 25 Q20 10 40 25 Q60 40 80 25 Q100 10 120 25" fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.6" />
      <path d="M0 5 Q20 -10 40 5 Q60 20 80 5 Q100 -10 120 5" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.4" />
    </>
  );
}

function TokusaPaths({ stroke }: { stroke: string }) {
  const lines = [0, 8, 16, 24, 32, 40];
  return (
    <>
      {lines.map((x) => (
        <line key={x} x1={x + 4} y1="0" x2={x + 4} y2="48" stroke={stroke} strokeWidth={x % 16 === 0 ? 1.2 : 0.6} opacity={x % 16 === 0 ? 1 : 0.5} />
      ))}
    </>
  );
}

function UrokoPaths({ stroke }: { stroke: string }) {
  // Triangle scales
  const row = (yOffset: number, xOffset: number) =>
    [-1, 0, 1, 2, 3].map((i) => (
      <polygon
        key={`${yOffset}-${i}`}
        points={`${xOffset + i * 24},${yOffset + 24} ${xOffset + i * 24 + 12},${yOffset} ${xOffset + i * 24 + 24},${yOffset + 24}`}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
      />
    ));
  return <>{row(0, 0)}{row(24, 12)}{row(48, 0)}</>;
}

function KikkoPaths({ stroke }: { stroke: string }) {
  // Hexagonal honeycomb
  const hex = (cx: number, cy: number) => {
    const r = 20;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (60 * i - 30);
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ");
    return <polygon key={`${cx}-${cy}`} points={pts} fill="none" stroke={stroke} strokeWidth="1" />;
  };
  return (
    <>
      {hex(20, 20)} {hex(60, 20)} {hex(40, 54)} {hex(80, 54)}
      {hex(0, 54)} {hex(100, 20)} {hex(20, 88)} {hex(60, 88)}
    </>
  );
}

function KarakusaPaths({ stroke }: { stroke: string }) {
  return (
    <>
      <path d="M10 50 Q20 20 40 30 Q60 40 50 10" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 10 Q80 0 70 30 Q60 50 90 40" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 30 Q30 50 10 50 Q-10 50 0 70" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 30 Q50 60 30 80" fill="none" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <circle cx="40" cy="30" r="3" fill={stroke} opacity="0.4" />
      <circle cx="10" cy="50" r="2" fill={stroke} opacity="0.3" />
      <circle cx="50" cy="10" r="2" fill={stroke} opacity="0.3" />
    </>
  );
}

const PATTERN_DEFS: Record<PatternType, PatternDef> = {
  seigaiha: {
    viewBox: "0 0 80 80",
    w: 80, h: 80,
    render: (stroke) => <SeigaihaPaths stroke={stroke} />,
    anim: "drift-x",
  },
  asanoha: {
    viewBox: "0 0 60 60",
    w: 60, h: 60,
    render: (stroke) => <AsanohaPaths stroke={stroke} />,
    anim: "breathe",
  },
  shippo: {
    viewBox: "0 0 80 80",
    w: 80, h: 80,
    render: (stroke) => <ShippoPaths stroke={stroke} />,
    anim: "drift-xy",
  },
  ichimatsu: {
    viewBox: "0 0 64 64",
    w: 64, h: 64,
    render: (_, fill) => <IchimatsuPaths fill={fill} />,
    anim: "none",
  },
  ryusuimon: {
    viewBox: "0 0 120 40",
    w: 120, h: 40,
    render: (stroke) => <RyusuimonPaths stroke={stroke} />,
    anim: "drift-x",
  },
  tokusa: {
    viewBox: "0 0 48 48",
    w: 48, h: 48,
    render: (stroke) => <TokusaPaths stroke={stroke} />,
    anim: "drift-y",
  },
  uroko: {
    viewBox: "0 0 96 72",
    w: 96, h: 72,
    render: (stroke) => <UrokoPaths stroke={stroke} />,
    anim: "drift-y",
  },
  kikko: {
    viewBox: "0 0 120 108",
    w: 120, h: 108,
    render: (stroke) => <KikkoPaths stroke={stroke} />,
    anim: "breathe",
  },
  karakusa: {
    viewBox: "0 0 100 90",
    w: 100, h: 90,
    render: (stroke) => <KarakusaPaths stroke={stroke} />,
    anim: "drift-xy",
  },
};

// Animation variants — all slow and subtle
const ANIM_VARIANTS: Record<string, object> = {
  "drift-x": {
    animate: { x: ["0%", "5%", "0%"] },
    transition: { duration: 18, ease: "easeInOut", repeat: Infinity },
  },
  "drift-y": {
    animate: { y: ["0%", "4%", "0%"] },
    transition: { duration: 22, ease: "easeInOut", repeat: Infinity },
  },
  "drift-xy": {
    animate: { x: ["0%", "3%", "0%"], y: ["0%", "2%", "0%"] },
    transition: { duration: 25, ease: "easeInOut", repeat: Infinity },
  },
  breathe: {
    animate: { scale: [1, 1.015, 1] },
    transition: { duration: 16, ease: "easeInOut", repeat: Infinity },
  },
  none: {},
};

export interface WagaraPatternProps {
  pattern: PatternType;
  className?: string;
  /** Stroke/fill color — defaults to currentColor (sumi) */
  color?: string;
  /** Overall opacity of the pattern layer */
  opacity?: number;
  /** Disable the scroll/drift animation */
  static?: boolean;
}

export function WagaraPattern({
  pattern,
  className = "",
  color = "currentColor",
  opacity = 0.07,
  static: isStatic = false,
}: WagaraPatternProps) {
  const shouldReduce = useReducedMotion();
  const def = PATTERN_DEFS[pattern];
  const patternId = `wp-${pattern}-${Math.random().toString(36).slice(2, 7)}`;
  const animKey = (!isStatic && !shouldReduce && def.anim) ? def.anim : "none";
  const { animate, transition } = (ANIM_VARIANTS[animKey] ?? {}) as {
    animate?: TargetAndTransition;
    transition?: Transition;
  };

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
    >
      <motion.svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        animate={animate}
        transition={transition}
        style={{ transformOrigin: "center" }}
      >
        <defs>
          <pattern
            id={patternId}
            viewBox={def.viewBox}
            width={def.w}
            height={def.h}
            patternUnits="userSpaceOnUse"
          >
            {def.render(color, color)}
          </pattern>
        </defs>
        <rect
          width="120%"
          height="120%"
          x="-10%"
          y="-10%"
          fill={`url(#${patternId})`}
          style={{ opacity }}
        />
      </motion.svg>
    </motion.div>
  );
}
