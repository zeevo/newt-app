import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import apiSrcIndex from "./templates/api-src-index";
import webServer from "./templates/web-server";
import webPackageJson from "./templates/web-package-json";
import webNextConfig from "./templates/web-next-config";
import webTsconfig from "./templates/web-tsconfig";
import webTsconfigServer from "./templates/web-tsconfig-server";

const singleProcessCustomServer: Module = {
  templates: [
    apiPackageJson,
    apiSrcIndex,
    webServer,
    webPackageJson,
    webNextConfig,
    webTsconfig,
    webTsconfigServer,
  ],
};

export default singleProcessCustomServer;
