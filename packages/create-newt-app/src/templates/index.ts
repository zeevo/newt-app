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
import nestDiOnlyModule from "./nest-di-only/index";
import deploymentStandaloneDi from "./deployment-standalone-di/index";
import apiControllers from "./api-controllers/index";
import bareModule from "./bare/index";
import {
  todoExampleDb,
  todoExampleNest,
  todoExampleControllers,
  todoExampleDi,
  todoExampleBare,
  todoExampleWeb,
  todoExampleShadcn,
} from "./todo-example/index";
import type { Module, ModuleSelection } from "./types";

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
  nestDiOnly: nestDiOnlyModule,
  deploymentStandaloneDi,
  apiControllers,
  bare: bareModule,
  todoExampleDb,
  todoExampleNest,
  todoExampleControllers,
  todoExampleDi,
  todoExampleBare,
  todoExampleWeb,
  todoExampleShadcn,
};

// The single source of truth for which modules a selection scaffolds. Kept here
// rather than in the CLI so the render tests exercise the real selection.
export function selectModules(selection: ModuleSelection): Module[] {
  const { deployment, mode, includeExample, shadcn, database, linter, testing } = selection;

  const diOnly = mode === "nest-di-only";
  const bare = mode === "bare";

  const deploymentModule =
    deployment === "standalone"
      ? deploymentStandalone
      : deployment === "custom-server"
        ? deploymentCustomServer
        : deployment === "spa"
          ? deploymentSpa
          : null;

  // In SPA mode NestJS serves Better Auth (AuthModule.forRoot); the Next.js
  // auth handler is redundant and can't be statically exported, so drop it.
  const webModule =
    deployment === "spa"
      ? {
          ...web,
          templates: web.templates.filter(
            (t) => t.filename !== "apps/web/app/api/auth/[...all]/route.ts",
          ),
        }
      : web;

  return [
    root,
    webModule,
    // bare mode emits no apps/api at all, so nothing NestJS comes with it
    ...(bare ? [bareModule] : [api]),
    database === "postgres" ? dbPostgres : dbSqlite,
    auth,
    shadcn ? shadcnUi : ui,
    linter === "oxc" ? oxc : eslintConfig,
    typescriptConfig,
    testing === "vitest" ? testingVitest : testingJest,
    ...(deploymentModule ? [deploymentModule] : []),
    ...(bare ? [] : diOnly ? [nestDiOnlyModule] : [apiControllers]),
    // nest-di-only overwrites the standalone next.config.js and leaves the
    // Dockerfile pointing at an api entrypoint DI-only never emits
    ...(diOnly && deployment === "standalone" ? [deploymentStandaloneDi] : []),
    ...(includeExample
      ? [
          todoExampleDb,
          ...(bare
            ? [todoExampleBare]
            : [todoExampleNest, diOnly ? todoExampleDi : todoExampleControllers]),
          shadcn ? todoExampleShadcn : todoExampleWeb,
        ]
      : []),
  ];
}
