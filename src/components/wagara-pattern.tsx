"use client";

import { motion } from "framer-motion";

type PatternType =
  | "seigaiha"
  | "shippo"
  | "asanoha"
  | "ichimatsu"
  | "ryusuimon";

interface WagaraPatternProps {
  pattern: PatternType;
  className?: string;
  opacity?: number;
}

const patterns: Record<
  PatternType,
  { viewBox: string; size: number; d: string }
> = {
  seigaiha: {
    viewBox: "0 0 80 40",
    size: 80,
    d: "M0 40 Q20 0 40 40 Q60 0 80 40 M-20 40 Q0 0 20 40 M60 40 Q80 0 100 40 M10 40 Q30 10 50 40 M30 40 Q50 10 70 40",
  },
  shippo: {
    viewBox: "0 0 40 40",
    size: 40,
    d: "M20 0 A20 20 0 0 1 40 20 A20 20 0 0 1 20 40 A20 20 0 0 1 0 20 A20 20 0 0 1 20 0 M0 0 A20 20 0 0 0 20 20 A20 20 0 0 0 40 0 M0 40 A20 20 0 0 1 20 20 A20 20 0 0 1 40 40",
  },
  asanoha: {
    viewBox: "0 0 60 60",
    size: 60,
    d: "M30 0 L30 30 M0 15 L30 30 M60 15 L30 30 M0 45 L30 30 M60 45 L30 30 M30 60 L30 30 M0 15 L30 0 L60 15 M0 45 L30 60 L60 45 M0 15 L0 45 M60 15 L60 45",
  },
  ichimatsu: {
    viewBox: "0 0 40 40",
    size: 40,
    d: "M0 0 H20 V20 H0 Z M20 20 H40 V40 H20 Z",
  },
  ryusuimon: {
    viewBox: "0 0 120 30",
    size: 120,
    d: "M0 15 Q15 0 30 15 Q45 30 60 15 Q75 0 90 15 Q105 30 120 15",
  },
};

export function WagaraPattern({
  pattern,
  className = "",
  opacity = 0.03,
}: WagaraPatternProps) {
  const { viewBox, size, d } = patterns[pattern];
  const patternId = `wagara-${pattern}`;
  const isFill = pattern === "ichimatsu";

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={patternId}
            viewBox={viewBox}
            width={size}
            height={pattern === "ryusuimon" ? 30 : size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={d}
              fill={isFill ? "currentColor" : "none"}
              stroke={isFill ? "none" : "currentColor"}
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          style={{ opacity }}
        />
      </svg>
    </motion.div>
  );
}
