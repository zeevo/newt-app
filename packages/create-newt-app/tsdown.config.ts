import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "esnext",
  outDir: "dist",
  // the bin field points at dist/index.js, so keep the extension off .mjs
  outExtensions: () => ({ js: ".js" }),
  dts: true,
  // Inlined as a literal at build time. Empty in local builds, in this repo's
  // CI and in every contributor's test run, so only an official release has an
  // endpoint to reach: nothing else can report a scaffold even by accident.
  env: {
    NEWT_TELEMETRY_URL: process.env.NEWT_TELEMETRY_URL || "",
  },
  // template static assets (fonts, binaries, svgs) resolved at runtime via
  // getStaticFilePath -> new URL("./static/...", import.meta.url)
  // the second pass re-adds the vendored plugin, whose .ts the first pass excludes
  onSuccess:
    'copyfiles -u 2 -e "**/*.ts" -e "**/*.tsx" "src/templates/**/*" dist/static && copyfiles -u 2 "src/templates/anti-slop/static/**/*" dist/static',
});
