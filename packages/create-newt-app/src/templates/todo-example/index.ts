import type { Module } from "../types";
import todosModule from "./templates/todos-module";
import todosService from "./templates/todos-service";
import todosServiceSpec from "./templates/todos-service-spec";
import dbSchema from "./templates/db-schema";
import dbMigrationTodos from "./templates/db-migration-todos";
import todosController from "./templates/todos-controller";
import todosModuleControllers from "./templates/todos-module-controllers";
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
  appModule: {
    importStatements: ["import { TodosModule } from './todos/todos.module';"],
    imports: ["TodosModule"],
  },
  templates: [
    todosModule,
    todosService,
    todosServiceSpec,
    dbSchema,
    dbMigrationTodos,
  ],
};

// api-controllers mode: REST controller plus app.module wired with TodosModule.
export const todoExampleControllers: Module = {
  templates: [todosController, todosModuleControllers],
};

// nest-di-only mode: Next.js route handlers plus app.module wired with TodosModule.
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
