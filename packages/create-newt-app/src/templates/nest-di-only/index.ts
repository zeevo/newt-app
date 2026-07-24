import type { Module } from '../types';
import apiPackageJson from './templates/api-package-json';
import apiTsconfig from './templates/api-tsconfig';
import apiIndex from './templates/api-index';
import webNestContext from './templates/web-nest-context';
import webPackageJson from './templates/web-package-json';
import webNextConfig from './templates/web-next-config';
import webTsconfig from './templates/web-tsconfig';
import webHelloRoute from './templates/web-hello-route';
const nestDiOnly: Module = {
  templates: [
    apiPackageJson,
    apiTsconfig,
    apiIndex,
    webNestContext,
    webHelloRoute,
    webPackageJson,
    webNextConfig,
    webTsconfig,
  ],
};

export default nestDiOnly;
