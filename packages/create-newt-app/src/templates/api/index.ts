import type { Module } from "../types";
import packageJson from "./templates/package-json";
import nestCli from "./templates/nest-cli";
import tsconfig from "./templates/tsconfig";
import tsconfigBuild from "./templates/tsconfig-build";
import appModule from "./templates/app-module";
import appService from "./templates/app-service";
import appServiceSpec from "./templates/app-service-spec";
import { versions } from "../versions";

const api: Module = {
  templates: [packageJson, nestCli, tsconfig, tsconfigBuild, appModule, appService, appServiceSpec],
  packages: [{ package: "zod", module: "apps/api", version: versions.zod }],
};

export default api;
