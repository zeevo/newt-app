import type { Module } from "../types";
import { versions } from "../versions";
import vitestConfig from "./templates/vitest-config";
import vitestConfigE2e from "./templates/vitest-config-e2e";
import e2eSpec from "./templates/e2e-spec";

const testingVitest: Module = {
  templates: [vitestConfig, vitestConfigE2e, e2eSpec],
  packages: [
    { package: "vitest", module: "apps/api", version: versions.vitest, dev: true },
    { package: "@vitest/coverage-v8", module: "apps/api", version: versions["@vitest/coverage-v8"], dev: true },
    { package: "unplugin-swc", module: "apps/api", version: versions["unplugin-swc"], dev: true },
    { package: "@swc/core", module: "apps/api", version: versions["@swc/core"], dev: true },
  ],
  scripts: [
    { module: "apps/api", name: "test", script: "vitest run" },
    { module: "apps/api", name: "test:watch", script: "vitest" },
    { module: "apps/api", name: "test:cov", script: "vitest run --coverage" },
    { module: "apps/api", name: "test:debug", script: "vitest --inspect-brk --inspect --logHeapUsage --threads=false" },
    { module: "apps/api", name: "test:e2e", script: "vitest run --config ./vitest.config.e2e.ts" },
  ],
};

export default testingVitest;
