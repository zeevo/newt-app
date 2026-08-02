import { fileURLToPath } from "node:url";
import root from "./root/index";
import web from "./web/index";
import api from "./api/index";
import auth from "./auth/index";
import { dbSqlite, dbPostgres } from "./db/index";
import ui from "./ui/index";
import shadcnUi from "./shadcn-ui/index";
import eslintConfig from "./eslint-config/index";
import oxc from "./oxc/index";
import typescriptConfig from "./typescript-config/index";
import testingJest from "./testing-jest/index";
import testingVitest from "./testing-vitest/index";
import deploymentStandalone from "./deployment-standalone/index";
import deploymentCustomServer from "./single-process-custom-server/index";
import deploymentSpa from "./single-process-static-export/index";
import nestDiOnly from "./nest-di-only/index";
import deploymentStandaloneDi from "./deployment-standalone-di/index";
import apiControllers from "./api-controllers/index";
import {
  todoExampleApi,
  todoExampleControllers,
  todoExampleDi,
  todoExampleWeb,
  todoExampleShadcn,
} from "./todo-example/index";

export * from "./types";

export const staticDir = new URL("./static/", import.meta.url);

export const staticDirPath = fileURLToPath(staticDir);

export function getStaticFilePath(name: string): string {
  return fileURLToPath(new URL(`./static/${name}`, import.meta.url));
}

const registry = {
  root,
  web,
  api,
  auth,
  dbSqlite,
  dbPostgres,
  ui,
  shadcnUi,
  eslintConfig,
  oxc,
  typescriptConfig,
  testingJest,
  testingVitest,
  deploymentStandalone,
  deploymentCustomServer,
  deploymentSpa,
  nestDiOnly,
  deploymentStandaloneDi,
  apiControllers,
  todoExampleApi,
  todoExampleControllers,
  todoExampleDi,
  todoExampleWeb,
  todoExampleShadcn,
};

// Each module carries its registry key so overwrite errors can name the culprit.
export const templates = Object.fromEntries(
  Object.entries(registry).map(([name, mod]) => [name, { ...mod, name }]),
) as typeof registry;
