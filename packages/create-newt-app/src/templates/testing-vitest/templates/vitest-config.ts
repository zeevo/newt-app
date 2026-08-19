import type { Selection } from "../../types";
export default {
  when: (s) => s.mode !== "bare",
  filename: "apps/api/vitest.config.mts",
  template: `import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});`,
};
