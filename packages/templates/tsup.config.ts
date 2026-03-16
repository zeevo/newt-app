import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  splitting: true,
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
  target: "esnext",
  outDir: "dist",
  onSuccess: 'copyfiles -u 1 -e "**/*.ts" -e "**/*.tsx" "src/**/*" dist/static',
});
