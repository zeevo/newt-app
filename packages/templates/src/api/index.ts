import type { Module } from "../types";
import packageJson from "./templates/package-json";
import nestCli from "./templates/nest-cli";
import tsconfig from "./templates/tsconfig";
import tsconfigBuild from "./templates/tsconfig-build";
import appModule from "./templates/app-module";
import appService from "./templates/app-service";
import appServiceSpec from "./templates/app-service-spec";
import readme from "./templates/readme";

const api: Module = {
  templates: [
    packageJson,
    nestCli,
    tsconfig,
    tsconfigBuild,
    appModule,
    appService,
    appServiceSpec,
    readme,
  ],
};

export default api;
