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
import antiSlop from "./anti-slop/index";
import typescriptConfig from "./typescript-config/index";
import testingJest from "./testing-jest/index";
import testingVitest from "./testing-vitest/index";
import deploymentStandalone from "./deployment-standalone/index";
import deploymentSpa from "./single-process-static-export/index";
import nestDiOnlyModule from "./nest-di-only/index";
import nestOff from "./nest-off/index";
import deploymentStandaloneWeb from "./deployment-standalone-web/index";
import apiControllers from "./api-controllers/index";
import {
  todoExampleApi,
  todoExampleControllers,
  todoExampleDi,
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
  antiSlop,
  typescriptConfig,
  testingJest,
  testingVitest,
  deploymentStandalone,
  deploymentSpa,
  nestDiOnly: nestDiOnlyModule,
  nestOff,
  deploymentStandaloneWeb,
  apiControllers,
  todoExampleApi,
  todoExampleControllers,
  todoExampleDi,
  todoExampleWeb,
  todoExampleShadcn,
};

const E2E_FILES = [
  "apps/api/test/app.e2e-spec.ts",
  "apps/api/test/jest-e2e.json",
  "apps/api/vitest.config.e2e.mts",
];

// The single source of truth for which modules a selection scaffolds. Kept here
// rather than in the CLI so the render tests exercise the real selection.
export function selectModules(selection: ModuleSelection): Module[] {
  const { deployment, nest, todoExample, shadcn, database, linter, testing, extras } = selection;

  const deploymentModule =
    deployment === "standalone"
      ? deploymentStandalone
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

  // Every testing config, script and dev dependency targets apps/api, so `off`
  // gets none of them. DI-only keeps the unit suite but drops the e2e one: its
  // Nest has no controllers of its own, so a suite booting apps/api has
  // nothing to hit.
  const selectedTesting = testing === "vitest" ? testingVitest : testingJest;
  const testingModule =
    nest === "off"
      ? null
      : nest === "di-only"
        ? {
            ...selectedTesting,
            templates: selectedTesting.templates.filter((t) => !E2E_FILES.includes(t.filename)),
            scripts: selectedTesting.scripts?.filter((s) => s.name !== "test:e2e"),
          }
        : selectedTesting;

  const nestModule =
    nest === "di-only" ? nestDiOnlyModule : nest === "off" ? nestOff : apiControllers;

  return [
    root,
    webModule,
    ...(nest === "off" ? [] : [api]),
    database === "postgres" ? dbPostgres : dbSqlite,
    auth,
    shadcn ? shadcnUi : ui,
    linter === "oxc" ? oxc : eslintConfig,
    ...(extras.includes("anti-slop") ? [antiSlop] : []),
    typescriptConfig,
    ...(testingModule ? [testingModule] : []),
    ...(deploymentModule ? [deploymentModule] : []),
    nestModule,
    // nest-di-only and nest-off both overwrite the standalone next.config.js
    // and leave the Dockerfile pointing at an api entrypoint neither emits
    ...(nest !== "on" && deployment === "standalone" ? [deploymentStandaloneWeb] : []),
    ...(todoExample
      ? [
          todoExampleApi,
          ...(nest === "di-only" ? [todoExampleDi] : [todoExampleControllers]),
          shadcn ? todoExampleShadcn : todoExampleWeb,
        ]
      : []),
  ];
}
