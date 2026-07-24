import type { Module } from "../types";
import apiAppModule from "./templates/api-app-module";
import apiPackageJson from "./templates/api-package-json";
import webNextConfig from "./templates/web-next-config";

const singleProcessStaticExport: Module = {
  templates: [apiAppModule, apiPackageJson, webNextConfig],
};

export default singleProcessStaticExport;
