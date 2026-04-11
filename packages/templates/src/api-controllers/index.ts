import type { Module } from '../types';
import appController from './templates/app-controller';
import appControllerSpec from './templates/app-controller-spec';
import appModule from './templates/app-module';
import todosController from './templates/todos-controller';
import todosModule from './templates/todos-module';

const apiControllers: Module = {
  templates: [
    appController,
    appControllerSpec,
    appModule,
    todosController,
    todosModule,
  ],
};

export default apiControllers;
