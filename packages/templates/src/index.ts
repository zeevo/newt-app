import { fileURLToPath } from "node:url";
import root from "./root/index";
import web from "./web/index";
import api from "./api/index";
import auth from "./auth/index";
import ui from "./ui/index";
import shadcnUi from "./shadcn-ui/index";
import eslintConfig from "./eslint-config/index";
import typescriptConfig from "./typescript-config/index";
import testingJest from "./testing-jest/index";
import testingVitest from "./testing-vitest/index";
import deploymentStandalone from "./deployment-standalone/index";
import deploymentCustomServer from "./single-process-custom-server/index";
import deploymentSpa from "./single-process-static-export/index";
import deploymentVercel from "./single-process-pages/index";
import nestDiOnly from "./nest-di-only/index";
import apiControllers from "./api-controllers/index";

export * from "./types";

export const staticDir = new URL("./static/", import.meta.url);

export const staticDirPath = fileURLToPath(staticDir);

export function getStaticFilePath(name: string): string {
  return fileURLToPath(new URL(`./static/${name}`, import.meta.url));
}

export const templates = {
  root,
  web,
  api,
  auth,
  ui,
  shadcnUi,
  eslintConfig,
  typescriptConfig,
  testingJest,
  testingVitest,
  deploymentStandalone,
  deploymentCustomServer,
  deploymentSpa,
  deploymentVercel,
  nestDiOnly,
  apiControllers,
};
