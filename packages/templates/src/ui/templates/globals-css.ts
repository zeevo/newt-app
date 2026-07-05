export default {
  filename: "packages/ui/src/globals.css",
  template: `@import 'tailwindcss';
@source "../../../apps/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

:root {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --border: oklch(0.469 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}

@layer base {
  html,
  body {
    height: 100%;
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    -webkit-font-smoothing: antialiased;
  }
  * {
    border-color: var(--border);
  }
}`,
};
