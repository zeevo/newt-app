export default {
  filename: "apps/api/vitest.config.ts",
  template: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});`,
};
