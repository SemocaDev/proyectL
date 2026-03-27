/**
 * Brand color constants — single source of truth para JS/TSX.
 * Los valores deben coincidir con las variables --brand-* en globals.css.
 * Usar estas constantes en props que necesitan strings (Recharts, SVG, inline styles).
 * Para clases Tailwind usar directamente: bg-beni, text-sumi, etc.
 */
export const colors = {
  shironeri: "#F9F7F2",
  sumi:      "#111827",
  ginnezumi: "#4B5563",
  hai:       "#E5E7EB",
  beni:      "#B94047",
  shu:       "#D3381C",
  ai:        "#2A4C7D",
  uguisu:    "#8A9A5B",
  white:     "#FFFFFF",
} as const;

/** Paleta de gráficas ordenada por relevancia visual */
export const chartColors = [
  colors.beni,
  colors.ai,
  colors.uguisu,
  colors.shu,
  colors.ginnezumi,
  "#a16207",
  "#0e7490",
  "#7c3aed",
] as const;

export type BrandColor = keyof typeof colors;
