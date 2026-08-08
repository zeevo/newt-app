import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'esnext',
  outDir: 'dist',
  // the bin field points at dist/index.js, so keep the extension off .mjs
  outExtensions: () => ({ js: '.js' }),
  dts: true,
  // template static assets (fonts, binaries, svgs) resolved at runtime via
  // getStaticFilePath -> new URL("./static/...", import.meta.url)
  onSuccess:
    'copyfiles -u 2 -e "**/*.ts" -e "**/*.tsx" "src/templates/**/*" dist/static',
});
