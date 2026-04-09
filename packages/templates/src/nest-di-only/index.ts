import type { Module } from '../types';
import apiPackageJson from './templates/api-package-json';
import apiTsconfig from './templates/api-tsconfig';
import apiIndex from './templates/api-index';
import apiAppModule from './templates/api-app-module';
import apiTodosService from './templates/api-todos-service';
import apiTodosModule from './templates/api-todos-module';
import webNestContext from './templates/web-nest-context';
import webTodosRoute from './templates/web-todos-route';
import webTodosIdRoute from './templates/web-todos-id-route';
import webTodosToggleRoute from './templates/web-todos-toggle-route';
import webPackageJson from './templates/web-package-json';
import webNextConfig from './templates/web-next-config';
import stubControllerSpec from './templates/stub-controller-spec';
import stubE2eSpec from './templates/stub-e2e-spec';
import apiTodosServiceSpec from './templates/api-todos-service-spec';

const nestDiOnly: Module = {
  templates: [
    apiPackageJson,
    apiTsconfig,
    apiIndex,
    apiAppModule,
    apiTodosService,
    apiTodosModule,
    webNestContext,
    webTodosRoute,
    webTodosIdRoute,
    webTodosToggleRoute,
    webPackageJson,
    webNextConfig,
    stubControllerSpec,
    stubE2eSpec,
    apiTodosServiceSpec,
  ],
};

export default nestDiOnly;
