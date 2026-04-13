import type { Module } from '../types';
import appController from './templates/app-controller';
import appControllerSpec from './templates/app-controller-spec';
import appModule from './templates/app-module';
import main from '../api/templates/main';
import todosController from './templates/todos-controller';
import todosModule from './templates/todos-module';

const apiControllers: Module = {
  templates: [
    appController,
    appControllerSpec,
    appModule,
    main,
    todosController,
    todosModule,
  ],
};

export default apiControllers;
