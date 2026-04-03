import type { Module } from "../types";
import packageJson from "./templates/package-json";
import eslintConfig from "./templates/eslint-config";
import nestCli from "./templates/nest-cli";
import tsconfig from "./templates/tsconfig";
import tsconfigBuild from "./templates/tsconfig-build";
import appController from "./templates/app-controller";
import appControllerSpec from "./templates/app-controller-spec";
import appModule from "./templates/app-module";
import main from "./templates/main";
import todosController from "./templates/todos-controller";
import todosModule from "./templates/todos-module";
import todosService from "./templates/todos-service";
import e2eSpec from "./templates/e2e-spec";
import jestE2e from "./templates/jest-e2e";
import readme from "./templates/readme";
import nestjsBetterAuthMock from "./templates/nestjs-better-auth-mock";

const api: Module = {
  templates: [
    packageJson,
    eslintConfig,
    nestCli,
    tsconfig,
    tsconfigBuild,
    appController,
    appControllerSpec,
    appModule,
    main,
    todosController,
    todosModule,
    todosService,
    e2eSpec,
    jestE2e,
    readme,
    nestjsBetterAuthMock,
  ],
};

export default api;
