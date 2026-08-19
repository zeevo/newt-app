import type { Module } from "../types";
import { versions } from "../versions";
import { API, WEB, isBare, skipWithoutApi } from "../api-targets";
import vitestConfig from "./templates/vitest-config";
import vitestConfigE2e from "./templates/vitest-config-e2e";
import e2eSpec from "./templates/e2e-spec";
import webVitestConfig from "./templates/web-vitest-config";
import webHelloSpec from "./templates/web-hello-spec";

const testingVitest: Module = {
  templates: [vitestConfig, vitestConfigE2e, e2eSpec, webVitestConfig, webHelloSpec],
  packages: [
    ...skipWithoutApi([
      {
        package: "vitest",
        module: API,
        version: versions.vitest,
        dev: true,
      },
      {
        package: "@vitest/coverage-v8",
        module: API,
        version: versions["@vitest/coverage-v8"],
        dev: true,
      },
      {
        package: "unplugin-swc",
        module: API,
        version: versions["unplugin-swc"],
        dev: true,
      },
      {
        package: "@swc/core",
        module: API,
        version: versions["@swc/core"],
        dev: true,
      },
    ]),
    // bare mode has no apps/api to hold the test setup, so apps/web carries it
    {
      package: "vitest",
      module: WEB,
      version: versions.vitest,
      dev: true,
      when: isBare,
    },
    {
      package: "@vitest/coverage-v8",
      module: WEB,
      version: versions["@vitest/coverage-v8"],
      dev: true,
      when: isBare,
    },
  ],
  scripts: [
    ...skipWithoutApi([
      { module: API, name: "test", script: "vitest run" },
      { module: API, name: "test:watch", script: "vitest" },
      { module: API, name: "test:cov", script: "vitest run --coverage" },
      {
        module: API,
        name: "test:debug",
        script: "vitest --inspect-brk --inspect --logHeapUsage --threads=false",
      },
      {
        module: API,
        name: "test:e2e",
        script: "vitest run --config ./vitest.config.e2e.mts",
      },
    ]),
    { module: WEB, name: "test", script: "vitest run", when: isBare },
    { module: WEB, name: "test:watch", script: "vitest", when: isBare },
    {
      module: WEB,
      name: "test:cov",
      script: "vitest run --coverage",
      when: isBare,
    },
  ],
};

export default testingVitest;
