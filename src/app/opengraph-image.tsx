import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DevMinds Links — URL Shortener & Link-in-Bio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  shironeri: "#F9F7F2",
  sumi:      "#111827",
  ginnezumi: "#4B5563",
  beni:      "#B94047",
};

// One seigaiha scale: 3 concentric upward arcs centred at (cx, cy), outer radius r
function Scale({ cx, cy, r, sw, col, op = 1 }: {
  cx: number; cy: number; r: number; sw: number; col: string; op?: number;
}) {
  return (
    <>
      <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke={col} strokeWidth={sw} strokeLinecap="round" fill="none" opacity={op} />
      <path d={`M${cx - r * 0.69} ${cy} A${r * 0.69} ${r * 0.69} 0 0 1 ${cx + r * 0.69} ${cy}`}
        stroke={col} strokeWidth={sw * 0.85} strokeLinecap="round" fill="none" opacity={op * 0.72} />
      <path d={`M${cx - r * 0.38} ${cy} A${r * 0.38} ${r * 0.38} 0 0 1 ${cx + r * 0.38} ${cy}`}
        stroke={col} strokeWidth={sw * 0.65} strokeLinecap="round" fill="none" opacity={op * 0.50} />
    </>
  );
}

// Tiled seigaiha field
function SeigaihaField({ x0, y0, w, h, r, col, sw, op }: {
  x0: number; y0: number; w: number; h: number;
  r: number; col: string; sw: number; op: number;
}) {
  const rowH = r * 0.866;
  const scales: React.ReactNode[] = [];
  let row = 0;
  for (let cy = y0 + r; cy < y0 + h + r; cy += rowH, row++) {
    const offset = (row % 2) * r;
    for (let cx = x0 - r + offset; cx < x0 + w + r; cx += r * 2) {
      scales.push(<Scale key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} sw={sw} col={col} op={op} />);
    }
  }
  return <>{scales}</>;
}

// Large logo mark: rows of seigaiha scales arranged in a pyramid
function LogoMark({ cx, cy, r, col, sw }: {
  cx: number; cy: number; r: number; col: string; sw: number;
}) {
  const rowH = r * 0.866;
  const rows = [
    { n: 4, y: cy },
    { n: 3, y: cy - rowH },
    { n: 4, y: cy - rowH * 2 },
    { n: 3, y: cy - rowH * 3 },
    { n: 2, y: cy - rowH * 4 },
  ];
  const scales: React.ReactNode[] = [];
  for (const { n, y } of rows) {
    const totalW = (n - 1) * r * 2;
    const startX = cx - totalW / 2;
    const stagger = n % 2 === 0 ? 0 : r;
    for (let i = 0; i < n; i++) {
      const x = startX + i * r * 2 + stagger;
      scales.push(<Scale key={`${x}-${y}`} cx={x} cy={y} r={r} sw={sw} col={col} />);
    }
  }
  return <>{scales}</>;
}

export default function OgImage() {
  const leftW  = 660;
  const divW   = 6;
  const rightX = leftW + divW;
  const rightCx = rightX + 270;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          display: "flex", position: "relative",
          background: C.shironeri,
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <svg
          width="1200" height="630"
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Faint full-canvas seigaiha */}
          <SeigaihaField x0={0} y0={0} w={1200} h={630} r={28} col={C.sumi} sw={0.5} op={0.04} />

          {/* Right panel denser beni seigaiha */}
          <SeigaihaField x0={rightX} y0={0} w={540} h={630} r={22} col={C.beni} sw={0.9} op={0.13} />

          {/* Right panel gradient fades left edge */}
          <defs>
            <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor={C.shironeri} stopOpacity="0.85" />
              <stop offset="45%" stopColor={C.shironeri} stopOpacity="0" />
            </linearGradient>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={C.beni} stopOpacity="0.12" />
              <stop offset="100%" stopColor={C.beni} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x={rightX} width="534" height="630" fill="url(#fade)" />

          {/* Halo behind logo mark */}
          <ellipse cx={rightCx} cy={310} rx={160} ry={160} fill="url(#halo)" />

          {/* Logo mark */}
          <LogoMark cx={rightCx} cy={340} r={38} col={C.beni} sw={2.2} />

          {/* Top accent bar */}
          <rect width="1200" height="5" fill={C.beni} />

          {/* Beni divider */}
          <rect x={leftW} width={divW} height="630" fill={C.beni} />
        </svg>

        {/* ── Left panel — text content ── */}
        <div
          style={{
            position: "absolute",
            left: 72, top: 0, width: leftW - 72,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 4, height: 28, background: C.beni, borderRadius: 2 }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: C.beni, letterSpacing: 3 }}>
              DEVMINDS LINKS
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={{ fontSize: 78, fontWeight: 300, color: C.sumi, letterSpacing: -2, lineHeight: 1.05 }}>
              Shorten.
            </span>
            <span style={{ fontSize: 78, fontWeight: 300, color: C.sumi, letterSpacing: -2, lineHeight: 1.05 }}>
              Share.
            </span>
            <span style={{ fontSize: 78, fontWeight: 300, color: C.beni, letterSpacing: -2, lineHeight: 1.05 }}>
              Connect.
            </span>
          </div>

          {/* Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 20, gap: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 300, color: C.ginnezumi, lineHeight: 1.5 }}>
              Short links &amp; link-in-bio pages with
            </span>
            <span style={{ fontSize: 22, fontWeight: 300, color: C.ginnezumi, lineHeight: 1.5 }}>
              Japanese-inspired design.
            </span>
          </div>

          {/* Pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            {["Fast redirect", "Analytics", "Link-in-bio"].map((f) => (
              <div key={f} style={{
                background: "rgba(185,64,71,0.09)",
                border: "1px solid rgba(185,64,71,0.22)",
                borderRadius: 999,
                padding: "7px 18px",
                fontSize: 16,
                fontWeight: 500,
                color: C.beni,
              }}>
                {f}
              </div>
            ))}
          </div>

          {/* URL */}
          <span style={{
            marginTop: 28,
            fontSize: 17,
            color: C.ginnezumi,
            opacity: 0.45,
            letterSpacing: 0.5,
          }}>
            l.devminds.online
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
