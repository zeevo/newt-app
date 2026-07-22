import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "esnext",
  outDir: "dist",
  splitting: false,
  // dts typechecks the bundled template modules (there is no separate lint step)
  dts: true,
  // template static assets (fonts, binaries, svgs) resolved at runtime via
  // getStaticFilePath -> new URL("./static/...", import.meta.url)
  onSuccess:
    'copyfiles -u 2 -e "**/*.ts" -e "**/*.tsx" "src/templates/**/*" dist/static',
});
