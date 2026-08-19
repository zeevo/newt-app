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
import webTodosLib from "./templates/web-todos-lib";
import webBareTodosRoute from "./templates/web-bare-todos-route";
import webBareTodosIdRoute from "./templates/web-bare-todos-id-route";
import webBareTodosToggleRoute from "./templates/web-bare-todos-toggle-route";
import webTodoList from "./templates/web-todo-list";
import webPage from "./templates/web-page";
import shadcnTodoList from "./templates/shadcn-todo-list";
import shadcnPage from "./templates/shadcn-page";

// Shared by every mode: the todo table's schema and migration.
export const todoExampleDb: Module = {
  templates: [dbSchema, dbMigrationTodos],
};

// The Kysely-backed todos service as a Nest provider, plus its module. Both
// NestJS modes use it; bare mode has its own plain-function version.
export const todoExampleNest: Module = {
  templates: [todosModule, todosService, todosServiceSpec],
};

// api-controllers mode: REST controller plus app.module wired with TodosModule.
export const todoExampleControllers: Module = {
  templates: [todosController, todosModuleControllers, appModuleControllers],
};

// nest-di-only mode: Next.js route handlers plus app.module wired with TodosModule.
export const todoExampleDi: Module = {
  templates: [webTodosRoute, webTodosIdRoute, webTodosToggleRoute, appModuleDi, apiIndex],
};

// bare mode: the same route handlers calling a plain module instead of a Nest
// provider. Same URLs, so the TodoList component below is unchanged.
export const todoExampleBare: Module = {
  templates: [webTodosLib, webBareTodosRoute, webBareTodosIdRoute, webBareTodosToggleRoute],
  // apps/web queries the database directly here; in the NestJS modes only
  // apps/api ever imports it.
  packages: [
    {
      package: "@<%= projectName %>/db",
      module: "apps/web",
      version: "workspace:*",
    },
  ],
};

// Web UI: TodoList component and the homepage that renders it.
export const todoExampleWeb: Module = {
  templates: [webTodoList, webPage],
};

export const todoExampleShadcn: Module = {
  templates: [shadcnTodoList, shadcnPage],
};
