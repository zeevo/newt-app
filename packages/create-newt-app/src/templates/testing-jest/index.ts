import type { Module } from "../types";
import { versions } from "../versions";
import { API, WEB, isBare, skipWithoutApi } from "../api-targets";
import jestConfig from "./templates/jest-config";
import jestE2eConfig from "./templates/jest-e2e-config";
import e2eSpec from "./templates/e2e-spec";
import nestjsBetterAuthMock from "./templates/nestjs-better-auth-mock";
import webJestConfig from "./templates/web-jest-config";
import webHelloSpec from "./templates/web-hello-spec";

const testingJest: Module = {
  templates: [
    jestConfig,
    jestE2eConfig,
    e2eSpec,
    nestjsBetterAuthMock,
    webJestConfig,
    webHelloSpec,
  ],
  packages: [
    ...skipWithoutApi([
      { package: "jest", module: API, version: versions.jest, dev: true },
      {
        package: "ts-jest",
        module: API,
        version: versions["ts-jest"],
        dev: true,
      },
      {
        package: "@types/jest",
        module: API,
        version: versions["@types/jest"],
        dev: true,
      },
      {
        package: "ts-loader",
        module: API,
        version: versions["ts-loader"],
        dev: true,
      },
      {
        package: "source-map-support",
        module: API,
        version: versions["source-map-support"],
        dev: true,
      },
    ]),
    // bare mode has no apps/api to hold the test setup, so apps/web carries it
    {
      package: "jest",
      module: WEB,
      version: versions.jest,
      dev: true,
      when: isBare,
    },
    {
      package: "ts-jest",
      module: WEB,
      version: versions["ts-jest"],
      dev: true,
      when: isBare,
    },
    {
      package: "@types/jest",
      module: WEB,
      version: versions["@types/jest"],
      dev: true,
      when: isBare,
    },
  ],
  scripts: [
    ...skipWithoutApi([
      { module: API, name: "test", script: "jest" },
      { module: API, name: "test:watch", script: "jest --watch" },
      { module: API, name: "test:cov", script: "jest --coverage" },
      {
        module: API,
        name: "test:debug",
        script:
          "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
      },
      {
        module: API,
        name: "test:e2e",
        script:
          "NODE_OPTIONS=--experimental-vm-modules jest --config ./test/jest-e2e.json",
      },
    ]),
    // apps/web is ESM, so jest needs the vm-modules flag to load the sources
    {
      module: WEB,
      name: "test",
      script: "NODE_OPTIONS=--experimental-vm-modules jest",
      when: isBare,
    },
    {
      module: WEB,
      name: "test:watch",
      script: "NODE_OPTIONS=--experimental-vm-modules jest --watch",
      when: isBare,
    },
    {
      module: WEB,
      name: "test:cov",
      script: "NODE_OPTIONS=--experimental-vm-modules jest --coverage",
      when: isBare,
    },
  ],
};

export default testingJest;
