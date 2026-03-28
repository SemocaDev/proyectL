"use client";

import { useId } from "react";
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

/**
 * Karakusa — algorithmically generated vine scrollwork using logarithmic spirals.
 *
 * Based on the mathematical model: r(θ) = a·e^(b·θ)
 * Each spiral can branch into two children with alternating rotation direction
 * and reduced scale (s ≈ 0.5), creating the characteristic Japanese arabesque.
 */

/** Sample a logarithmic spiral and return SVG path data using cubic bezier approximation */
function spiralPath(
  cx: number, cy: number,
  a: number, b: number,
  thetaStart: number, thetaEnd: number,
  steps: number,
): string {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = thetaStart + (thetaEnd - thetaStart) * (i / steps);
    const r = a * Math.exp(b * theta);
    pts.push([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);
  }

  // Convert sampled points into cubic bezier segments using Catmull-Rom → Bezier
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    // Catmull-Rom to cubic bezier conversion (tension = 0.5)
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Get a point on a logarithmic spiral */
function spiralPoint(cx: number, cy: number, a: number, b: number, theta: number): [number, number] {
  const r = a * Math.exp(b * theta);
  return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)];
}

/** Small leaf shape at a given point and angle */
function leafPath(x: number, y: number, angle: number, size: number): string {
  const dx = Math.cos(angle) * size;
  const dy = Math.sin(angle) * size;
  const nx = -dy * 0.5;
  const ny = dx * 0.5;
  return `M${x.toFixed(1)},${y.toFixed(1)} C${(x + dx * 0.3 + nx).toFixed(1)},${(y + dy * 0.3 + ny).toFixed(1)} ${(x + dx * 0.7 + nx).toFixed(1)},${(y + dy * 0.7 + ny).toFixed(1)} ${(x + dx).toFixed(1)},${(y + dy).toFixed(1)} C${(x + dx * 0.7 - nx).toFixed(1)},${(y + dy * 0.7 - ny).toFixed(1)} ${(x + dx * 0.3 - nx).toFixed(1)},${(y + dy * 0.3 - ny).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
}

function KarakusaPaths({ stroke }: { stroke: string }) {
  const PI = Math.PI;

  // Main vine — mother spiral (counterclockwise, b > 0)
  const mainD = spiralPath(50, 50, 5, 0.18, -PI, 2.2 * PI, 40);

  // Branch point 1: at θ ≈ π (halfway through main spiral)
  const [bx1, by1] = spiralPoint(50, 50, 5, 0.18, PI);
  // Child spiral 1: clockwise (b < 0), smaller scale
  const child1D = spiralPath(bx1, by1, 3, -0.22, 0, 1.8 * PI, 24);

  // Branch point 2: at θ ≈ 0.3π
  const [bx2, by2] = spiralPoint(50, 50, 5, 0.18, 0.3 * PI);
  // Child spiral 2: clockwise, even smaller
  const child2D = spiralPath(bx2, by2, 2.5, -0.20, PI * 0.5, 2 * PI, 20);

  // Branch point 3: grandchild from child1 at θ ≈ π
  const [bx3, by3] = spiralPoint(bx1, by1, 3, -0.22, PI);
  const grandD = spiralPath(bx3, by3, 1.8, 0.25, 0, 1.5 * PI, 16);

  // Small tendril from edge (connects to adjacent tile)
  const edgeD = spiralPath(0, 50, 2, 0.20, -0.3 * PI, 1.2 * PI, 16);

  // Leaves at branch junctions
  const leaf1 = leafPath(bx1, by1, PI * 0.7, 5);
  const leaf2 = leafPath(bx2, by2, -PI * 0.3, 4);
  const leaf3 = leafPath(bx3, by3, PI * 1.2, 3.5);

  return (
    <>
      {/* Main vine spiral */}
      <path d={mainD} fill="none" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      {/* Child spiral 1 (clockwise) */}
      <path d={child1D} fill="none" stroke={stroke} strokeWidth="1.0" strokeLinecap="round" />
      {/* Child spiral 2 (clockwise) */}
      <path d={child2D} fill="none" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      {/* Grandchild spiral (counterclockwise) */}
      <path d={grandD} fill="none" stroke={stroke} strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      {/* Edge tendril for seamless tiling */}
      <path d={edgeD} fill="none" stroke={stroke} strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
      {/* Leaves at branch points */}
      <path d={leaf1} fill={stroke} stroke="none" opacity="0.25" />
      <path d={leaf2} fill={stroke} stroke="none" opacity="0.20" />
      <path d={leaf3} fill={stroke} stroke="none" opacity="0.15" />
      {/* Junction dots */}
      <circle cx={bx1.toFixed(1)} cy={by1.toFixed(1)} r="1.5" fill={stroke} opacity="0.3" />
      <circle cx={bx2.toFixed(1)} cy={by2.toFixed(1)} r="1.2" fill={stroke} opacity="0.25" />
      <circle cx={bx3.toFixed(1)} cy={by3.toFixed(1)} r="1" fill={stroke} opacity="0.2" />
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
    viewBox: "-10 -10 120 120",
    w: 100, h: 100,
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
  const uid = useId();
  const shouldReduce = useReducedMotion();
  const def = PATTERN_DEFS[pattern];
  const patternId = `wp-${pattern}-${uid.replace(/:/g, "")}`;
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
