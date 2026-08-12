import type { Module } from "../types";
import todosService from "./templates/todos-service";
import todosServiceSpec from "./templates/todos-service-spec";
import dbSchema from "./templates/db-schema";
import dbMigrationTodos from "./templates/db-migration-todos";
import todosController from "./templates/todos-controller";
import todosModuleControllers from "./templates/todos-module-controllers";
import appModuleControllers from "./templates/app-module-controllers";
import apiIndex from "./templates/api-index";
import webTodosRoute from "./templates/web-todos-route";
import webTodosIdRoute from "./templates/web-todos-id-route";
import webTodosToggleRoute from "./templates/web-todos-toggle-route";
import webTodoList from "./templates/web-todo-list";
import webPage from "./templates/web-page";
import shadcnTodoList from "./templates/shadcn-todo-list";
import shadcnPage from "./templates/shadcn-page";

// Shared by every mode: the REST controller, its Nest module, the Kysely-backed
// todos service, and the db schema + migration for the todo table. DI-only
// serves the controller through @newt-app/nest-next-adapter instead of a
// standalone server.
export const todoExampleApi: Module = {
  templates: [
    todosController,
    todosModuleControllers,
    appModuleControllers,
    todosService,
    todosServiceSpec,
    dbSchema,
    dbMigrationTodos,
  ],
};

// nest-di-only mode: route files binding the controller into Next.js.
export const todoExampleDi: Module = {
  templates: [webTodosRoute, webTodosIdRoute, webTodosToggleRoute, apiIndex],
};

// Web UI: TodoList component and the homepage that renders it.
export const todoExampleWeb: Module = {
  templates: [webTodoList, webPage],
};

export const todoExampleShadcn: Module = {
  templates: [shadcnTodoList, shadcnPage],
};
