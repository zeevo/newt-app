import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "bare",
  filename: "apps/web/vitest.config.mts",
  template: `import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});`,
};
