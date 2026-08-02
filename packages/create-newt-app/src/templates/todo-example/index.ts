import type { Module } from "../types";
import todosModule from "./templates/todos-module";
import todosService from "./templates/todos-service";
import todosServiceSpec from "./templates/todos-service-spec";
import dbSchema from "./templates/db-schema";
import dbMigrationTodos from "./templates/db-migration-todos";
import todosController from "./templates/todos-controller";
import todosModuleControllers from "./templates/todos-module-controllers";
import appModuleControllers from "./templates/app-module-controllers";
import appModuleDi from "./templates/app-module-di";
import apiIndex from "./templates/api-index";
import webTodosRoute from "./templates/web-todos-route";
import webTodosIdRoute from "./templates/web-todos-id-route";
import webTodosToggleRoute from "./templates/web-todos-toggle-route";
import webTodoList from "./templates/web-todo-list";
import webPage from "./templates/web-page";
import shadcnTodoList from "./templates/shadcn-todo-list";
import shadcnPage from "./templates/shadcn-page";

// Shared by every mode: the Kysely-backed todos service, its Nest module, and
// the db schema + migration for the todo table.
export const todoExampleApi: Module = {
  templates: [
    todosModule,
    todosService,
    todosServiceSpec,
    dbSchema,
    dbMigrationTodos,
  ],
  // the todo example owns the db schema, whichever driver was selected
  overrides: [
    { file: "packages/db/src/schema.ts", from: "dbSqlite" },
    { file: "packages/db/src/schema.ts", from: "dbPostgres" },
  ],
};

// api-controllers mode: REST controller plus app.module wired with TodosModule.
export const todoExampleControllers: Module = {
  templates: [todosController, todosModuleControllers, appModuleControllers],
  overrides: [
    { file: "apps/api/src/app.module.ts", from: "apiControllers" },
    { file: "apps/api/src/todos/todos.module.ts", from: "todoExampleApi" },
  ],
};

// nest-di-only mode: Next.js route handlers plus app.module wired with TodosModule.
export const todoExampleDi: Module = {
  templates: [webTodosRoute, webTodosIdRoute, webTodosToggleRoute, appModuleDi, apiIndex],
  overrides: [
    { file: "apps/api/src/app.module.ts", from: "api" },
    { file: "apps/api/src/index.ts", from: "nestDiOnly" },
  ],
};

// Web UI: TodoList component and the homepage that renders it.
export const todoExampleWeb: Module = {
  templates: [webTodoList, webPage],
  overrides: [{ file: "apps/web/app/page.tsx", from: "web" }],
};

export const todoExampleShadcn: Module = {
  templates: [shadcnTodoList, shadcnPage],
  overrides: [{ file: "apps/web/app/page.tsx", from: "shadcnUi" }],
};
