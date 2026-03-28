import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DevMinds Links — URL Shortener & Link-in-Bio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand colours
const C = {
  shironeri: "#F9F7F2",
  sumi:      "#111827",
  ginnezumi: "#4B5563",
  hai:       "#E5E7EB",
  beni:      "#B94047",
  ai:        "#2A4C7D",
};

// ── Seigaiha scale: 3 concentric arcs, upward-opening ────────────────────────
// cx, cy = bottom-centre of the scale, r = outer radius
function scale(cx: number, cy: number, r: number, sw = 1.2, col = C.beni, op = 1) {
  return `
    <path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}"
      stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none" opacity="${op}"/>
    <path d="M${cx - r * 0.69} ${cy} A${r * 0.69} ${r * 0.69} 0 0 1 ${cx + r * 0.69} ${cy}"
      stroke="${col}" stroke-width="${sw * 0.85}" stroke-linecap="round" fill="none" opacity="${op * 0.75}"/>
    <path d="M${cx - r * 0.38} ${cy} A${r * 0.38} ${r * 0.38} 0 0 1 ${cx + r * 0.38} ${cy}"
      stroke="${col}" stroke-width="${sw * 0.7}" stroke-linecap="round" fill="none" opacity="${op * 0.55}"/>
  `;
}

// ── Full seigaiha tile field ───────────────────────────────────────────────────
// Fills a region with a grid of scales. r = unit radius, stagger = half-unit.
function seigaihaField(
  x0: number, y0: number, w: number, h: number,
  r: number, col: string, sw: number, op: number
): string {
  const rowH = r * 0.866; // vertical distance between rows (equilateral triangle height)
  let svg = "";
  let row = 0;
  for (let cy = y0 + r; cy < y0 + h + r; cy += rowH, row++) {
    const offset = (row % 2) * r; // alternate rows stagger by r
    for (let cx = x0 - r + offset; cx < x0 + w + r; cx += r * 2) {
      svg += scale(cx, cy, r, sw, col, op);
    }
  }
  return svg;
}

// ── Large logo-mark: 5 rows of seigaiha, centred at (cx,cy), unit radius r ──
function logoMark(cx: number, cy: number, r: number, col: string, sw: number): string {
  const rowH = r * 0.866;
  // Layout: rows 0..4 (bottom→top), each row n has (n+1) scales, staggered
  let svg = "";

  const rows = [
    { n: 4, y: cy },
    { n: 3, y: cy - rowH },
    { n: 4, y: cy - rowH * 2 },
    { n: 3, y: cy - rowH * 3 },
    { n: 2, y: cy - rowH * 4 },
  ];

  for (const { n, y } of rows) {
    const totalW = (n - 1) * r * 2;
    const startX = cx - totalW / 2;
    const stagger = (n % 2 === 0) ? 0 : r;
    for (let i = 0; i < n; i++) {
      const x = startX + i * r * 2 + stagger;
      svg += scale(x, y, r, sw, col, 1);
    }
  }
  return svg;
}

export default function OgImage() {
  // Left panel: 660px wide. Right panel: 540px wide.
  const leftW = 660;
  const rightX = leftW + 6; // +6 for divider bar

  // Background seigaiha (full canvas, very faint)
  const bgField = seigaihaField(0, 0, 1200, 630, 28, C.sumi, 0.5, 0.035);

  // Right panel: denser seigaiha in beni
  const rightField = seigaihaField(rightX, 0, 540, 630, 22, C.beni, 0.8, 0.12);

  // Central logo mark on right panel
  const mark = logoMark(rightX + 270, 310, 38, C.beni, 2.2);

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <!-- Background -->
      <rect width="1200" height="630" fill="${C.shironeri}"/>

      <!-- Full-canvas faint seigaiha -->
      ${bgField}

      <!-- Right panel tint -->
      <rect x="${rightX}" width="534" height="630" fill="${C.beni}" opacity="0.04"/>

      <!-- Right panel seigaiha -->
      ${rightField}

      <!-- Right panel overlay gradient (left edge → transparent) -->
      <defs>
        <linearGradient id="rpg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${C.shironeri}" stop-opacity="0.7"/>
          <stop offset="40%" stop-color="${C.shironeri}" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="glow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stop-color="${C.beni}" stop-opacity="0.18"/>
          <stop offset="50%"  stop-color="${C.beni}" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="${C.beni}" stop-opacity="0.18"/>
        </linearGradient>
      </defs>
      <rect x="${rightX}" width="534" height="630" fill="url(#rpg)"/>
      <rect x="${rightX}" width="534" height="630" fill="url(#glow)"/>

      <!-- Beni divider bar -->
      <rect x="${leftW}" width="6" height="630" fill="${C.beni}"/>

      <!-- Logo mark (large, centred in right panel) -->
      ${mark}

      <!-- Accent mark glow circle -->
      <circle cx="${rightX + 270}" cy="310" r="120" fill="${C.beni}" opacity="0.06"/>
      <circle cx="${rightX + 270}" cy="310" r="75"  fill="${C.beni}" opacity="0.06"/>

      <!-- Top accent bar -->
      <rect width="1200" height="5" fill="${C.beni}"/>

      <!-- ── Left panel content ── -->

      <!-- Brand name -->
      <text x="72" y="112"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="600" letter-spacing="3"
        fill="${C.beni}" opacity="0.9">
        DEVMINDS LINKS
      </text>

      <!-- Small seigaiha accent mark beside brand name -->
      ${scale(46, 112, 10, 1.6, C.beni, 0.9)}

      <!-- Headline -->
      <text x="72" y="214"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="72" font-weight="300" letter-spacing="-2"
        fill="${C.sumi}">
        Shorten.
      </text>
      <text x="72" y="298"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="72" font-weight="300" letter-spacing="-2"
        fill="${C.sumi}">
        Share.
      </text>
      <text x="72" y="382"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="72" font-weight="300" letter-spacing="-2"
        fill="${C.beni}">
        Connect.
      </text>

      <!-- Subtitle -->
      <text x="72" y="444"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="300"
        fill="${C.ginnezumi}">
        Short links &amp; link-in-bio pages with
      </text>
      <text x="72" y="474"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="300"
        fill="${C.ginnezumi}">
        Japanese-inspired design.
      </text>

      <!-- Feature pills -->
      <rect x="72"  y="510" width="152" height="36" rx="18" fill="${C.beni}" opacity="0.10"/>
      <rect x="236" y="510" width="178" height="36" rx="18" fill="${C.beni}" opacity="0.10"/>
      <rect x="426" y="510" width="152" height="36" rx="18" fill="${C.beni}" opacity="0.10"/>

      <text x="148" y="533" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16" font-weight="500" fill="${C.beni}">
        Fast redirect
      </text>
      <text x="325" y="533" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16" font-weight="500" fill="${C.beni}">
        Analytics
      </text>
      <text x="502" y="533" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16" font-weight="500" fill="${C.beni}">
        Link-in-bio
      </text>

      <!-- URL footer -->
      <text x="72" y="598"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="18" font-weight="400" letter-spacing="0.5"
        fill="${C.ginnezumi}" opacity="0.5">
        l.devminds.online
      </text>
    </svg>
  `;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`}
          width={1200}
          height={630}
          alt=""
        />
      </div>
    ),
    { ...size }
  );
}
