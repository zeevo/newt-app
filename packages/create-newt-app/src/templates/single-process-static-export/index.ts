import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import webNextConfig from "./templates/web-next-config";

// app.module.ts is not templated here: api-controllers and todo-example both
// write that file and land after this module, so anything emitted here is
// overwritten. Those templates add ServeStaticModule when deployment is 'spa'.
const singleProcessStaticExport: Module = {
  templates: [apiPackageJson, webNextConfig],
};

export default singleProcessStaticExport;
