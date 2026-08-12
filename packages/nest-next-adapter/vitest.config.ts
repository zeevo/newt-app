import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  // esbuild drops emitDecoratorMetadata, which Nest constructor injection
  // needs, so tests compile through swc like the scaffolded api app does
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
