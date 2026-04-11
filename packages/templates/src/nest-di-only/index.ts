import type { Module } from '../types';
import apiPackageJson from './templates/api-package-json';
import apiTsconfig from './templates/api-tsconfig';
import apiIndex from './templates/api-index';
import appModule from './templates/app-module';
import appController from './templates/app-controller';
import appControllerSpec from './templates/app-controller-spec';
import todosModule from './templates/todos-module';
import todosController from './templates/todos-controller';
import webNestContext from './templates/web-nest-context';
import webTodosRoute from './templates/web-todos-route';
import webTodosIdRoute from './templates/web-todos-id-route';
import webTodosToggleRoute from './templates/web-todos-toggle-route';
import webPackageJson from './templates/web-package-json';
import webNextConfig from './templates/web-next-config';
import webTsconfig from './templates/web-tsconfig';
const nestDiOnly: Module = {
  templates: [
    apiPackageJson,
    apiTsconfig,
    apiIndex,
    appModule,
    appController,
    appControllerSpec,
    todosModule,
    todosController,
    webNestContext,
    webTodosRoute,
    webTodosIdRoute,
    webTodosToggleRoute,
    webPackageJson,
    webNextConfig,
    webTsconfig,
  ],
};

export default nestDiOnly;
