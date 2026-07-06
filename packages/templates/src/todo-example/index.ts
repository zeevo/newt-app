import type { Module } from "../types";
import todosModule from "./templates/todos-module";
import todosService from "./templates/todos-service";
import todosServiceSpec from "./templates/todos-service-spec";
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

// Shared by every mode: the in-memory todos service and its Nest module.
export const todoExampleApi: Module = {
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

// Web UI: TodoList component and the homepage that renders it.
export const todoExampleWeb: Module = {
  templates: [webTodoList, webPage],
};

export const todoExampleShadcn: Module = {
  templates: [shadcnTodoList, shadcnPage],
};
