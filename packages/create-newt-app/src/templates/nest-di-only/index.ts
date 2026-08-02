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
  overrides: [
    { file: "apps/api/package.json", from: "api" },
    { file: "apps/api/tsconfig.json", from: "api" },
    { file: "apps/web/next.config.js", from: "web" },
    // standalone composes first, so DI-only replaces its config and the
    // deploymentStandaloneDi module puts output: "standalone" back
    { file: "apps/web/next.config.js", from: "deploymentStandalone" },
    { file: "apps/web/package.json", from: "web" },
    { file: "apps/web/tsconfig.json", from: "web" },
  ],
};

export default nestDiOnly;
