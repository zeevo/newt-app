export default {
  filename: "packages/ui/src/tokens.stylex.ts",
  template: `import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  mutedForeground: "oklch(0.708 0 0)",
  border: "oklch(0.469 0 0)",
  accent: "oklch(0.985 0 0)",
  accentForeground: "oklch(0.205 0 0)",
  danger: "oklch(0.637 0.237 25.331)",
});

export const fonts = stylex.defineVars({
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
});

export const radii = stylex.defineVars({
  sm: "6px",
  md: "8px",
  lg: "12px",
});
`,
};
