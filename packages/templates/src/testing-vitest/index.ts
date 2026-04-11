import type { Module } from "../types";
import vitestConfig from "./templates/vitest-config";
import vitestConfigE2e from "./templates/vitest-config-e2e";
import appControllerSpec from "./templates/app-controller-spec";
import e2eSpec from "./templates/e2e-spec";
import todosServiceSpec from "./templates/todos-service-spec";

const testingVitest: Module = {
  templates: [vitestConfig, vitestConfigE2e, appControllerSpec, e2eSpec, todosServiceSpec],
  packages: [
    { package: "vitest", module: "apps/api", version: "^3.0.0", dev: true },
    { package: "@vitest/coverage-v8", module: "apps/api", version: "^3.0.0", dev: true },
    { package: "unplugin-swc", module: "apps/api", version: "^1.5.9", dev: true },
    { package: "@swc/core", module: "apps/api", version: "^1.10.0", dev: true },
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
