import type { Module } from "../types";
import packageJson from "./templates/package-json";
import eslintConfig from "./templates/eslint-config";
import nestCli from "./templates/nest-cli";
import tsconfig from "./templates/tsconfig";
import tsconfigBuild from "./templates/tsconfig-build";
import appController from "./templates/app-controller";
import appModule from "./templates/app-module";
import main from "./templates/main";
import todosController from "./templates/todos-controller";
import todosModule from "./templates/todos-module";
import todosService from "./templates/todos-service";
import todosServiceSpec from "./templates/todos-service-spec";
import readme from "./templates/readme";

const api: Module = {
  templates: [
    packageJson,
    eslintConfig,
    nestCli,
    tsconfig,
    tsconfigBuild,
    appController,
    appModule,
    main,
    todosController,
    todosModule,
    todosService,
    todosServiceSpec,
    readme,
  ],
};

export default api;
