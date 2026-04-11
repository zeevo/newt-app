import type { Module } from '../types';
import apiPackageJson from './templates/api-package-json';
import apiTsconfig from './templates/api-tsconfig';
import apiIndex from './templates/api-index';
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
