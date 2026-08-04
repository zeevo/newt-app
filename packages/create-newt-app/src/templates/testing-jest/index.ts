import type { Module } from "../types";
import { versions } from "../versions";
import jestConfig from "./templates/jest-config";
import jestE2eConfig from "./templates/jest-e2e-config";
import e2eSpec from "./templates/e2e-spec";
import nestjsBetterAuthMock from "./templates/nestjs-better-auth-mock";

const testingJest: Module = {
  templates: [jestConfig, jestE2eConfig, e2eSpec, nestjsBetterAuthMock],
  packages: [
    { package: "jest", module: "apps/api", version: versions.jest, dev: true },
    { package: "ts-jest", module: "apps/api", version: versions["ts-jest"], dev: true },
    { package: "@types/jest", module: "apps/api", version: versions["@types/jest"], dev: true },
    { package: "ts-loader", module: "apps/api", version: versions["ts-loader"], dev: true },
    { package: "source-map-support", module: "apps/api", version: versions["source-map-support"], dev: true },
  ],
  scripts: [
    { module: "apps/api", name: "test", script: "jest" },
    { module: "apps/api", name: "test:watch", script: "jest --watch" },
    { module: "apps/api", name: "test:cov", script: "jest --coverage" },
    { module: "apps/api", name: "test:debug", script: "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand" },
    { module: "apps/api", name: "test:e2e", script: "jest --config ./test/jest-e2e.json" },
  ],
};

export default testingJest;
