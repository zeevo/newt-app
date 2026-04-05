import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import apiSrcIndex from "./templates/api-src-index";
import webInstrumentation from "./templates/web-instrumentation";
import webPackageJson from "./templates/web-package-json";

const singleProcessInstrumentation: Module = {
  templates: [
    apiPackageJson,
    apiSrcIndex,
    webInstrumentation,
    webPackageJson,
  ],
};

export default singleProcessInstrumentation;
