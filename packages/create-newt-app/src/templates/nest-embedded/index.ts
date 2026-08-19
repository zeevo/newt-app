import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import apiIndex from "./templates/api-index";
import webNest from "./templates/web-nest";
import webApiCatchall from "./templates/web-api-catchall";
import webPackageJson from "./templates/web-package-json";
import webNextConfig from "./templates/web-next-config";
import webTsconfig from "./templates/web-tsconfig";

// Composed after api-controllers, whose controllers, AuthModule and AuthGuard
// this mode reuses unchanged. Only the packaging differs: the api is consumed
// as TS source by the web app instead of being served by its own process, so
// there is no apps/api/src/main.ts.
const nestEmbedded: Module = {
  templates: [
    apiPackageJson,
    apiIndex,
    webNest,
    webApiCatchall,
    webPackageJson,
    webNextConfig,
    webTsconfig,
  ],
};

export default nestEmbedded;
