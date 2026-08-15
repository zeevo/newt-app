import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  // no hooks or context, so the component renders in a server component; a
  // "use client" banner here would take that away from consumers
  external: ["react"],
});
