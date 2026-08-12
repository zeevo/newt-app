import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  platform: "node",
  external: ["@nestjs/common", "@nestjs/core", "@nestjs/platform-express", "reflect-metadata"],
});
