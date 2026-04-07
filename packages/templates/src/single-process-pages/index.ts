import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import apiSrcIndex from "./templates/api-src-index";
import npmrc from "./templates/npmrc";
import webApiCatchall from "./templates/web-api-catchall";
import webPackageJson from "./templates/web-package-json";
import webNextConfig from "./templates/web-next-config";

const singleProcessPages: Module = {
  templates: [
    npmrc,
    apiPackageJson,
    apiSrcIndex,
    webApiCatchall,
    webPackageJson,
    webNextConfig,
  ],
};

export default singleProcessPages;
