import type { ButtonStyle } from "./schemas";

export function getButtonClasses(style?: ButtonStyle, bgTheme?: string): string {
  const shape = style?.shape ?? "rounded";
  const variant = style?.variant ?? "filled";
  const isDark = bgTheme === "dark";

  const shapeClass =
    shape === "pill"
      ? "rounded-full"
      : shape === "sharp"
        ? "rounded-none"
        : "rounded-lg";

  const variantClass =
    variant === "outline"
      ? isDark
        ? "border border-white/30 bg-transparent hover:bg-white/10"
        : "border border-hai bg-transparent hover:bg-black/5"
      : isDark
        ? "bg-white/15 hover:bg-white/20"
        : "bg-white shadow-sm hover:shadow-md";

  return `${shapeClass} ${variantClass}`;
}

export function getShapeClass(style?: ButtonStyle): string {
  const shape = style?.shape ?? "rounded";
  return shape === "pill"
    ? "rounded-full"
    : shape === "sharp"
      ? "rounded-none"
      : "rounded-lg";
}

export function getTextColor(bgTheme?: string): string {
  return bgTheme === "dark" ? "text-white" : "text-sumi";
}

export function getSubTextColor(bgTheme?: string): string {
  return bgTheme === "dark" ? "text-white/60" : "text-ginnezumi";
}
