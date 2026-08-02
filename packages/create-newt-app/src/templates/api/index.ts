import type { Module } from "../types";
import packageJson from "./templates/package-json";
import nestCli from "./templates/nest-cli";
import tsconfig from "./templates/tsconfig";
import tsconfigBuild from "./templates/tsconfig-build";
import appService from "./templates/app-service";
import appServiceSpec from "./templates/app-service-spec";
import readme from "./templates/readme";

const api: Module = {
  appModule: {
    importStatements: [
      "import { Module } from '@nestjs/common';",
      "import { AppService } from './app.service';",
    ],
    providers: ["AppService"],
  },
  templates: [
    packageJson,
    nestCli,
    tsconfig,
    tsconfigBuild,
    appService,
    appServiceSpec,
    readme,
  ],
};

export default api;
