import type { Module } from "../types";
import apiPackageJson from "./templates/api-package-json";
import apiSrcIndex from "./templates/api-src-index";
import webServer from "./templates/web-server";
import webPackageJson from "./templates/web-package-json";
import webNextConfig from "./templates/web-next-config";
import webTsconfig from "./templates/web-tsconfig";
import webTsconfigServer from "./templates/web-tsconfig-server";
import turboJson from "./templates/turbo-json";

// server.ts loads the api as compiled output, not TS source: esbuild (via tsx)
// won't apply the api's decorator settings to files outside apps/web, so the
// Nest module can only be consumed from apps/api/dist. That makes dev depend on
// the api build, hence the turbo.json override.
const singleProcessCustomServer: Module = {
  templates: [
    apiPackageJson,
    apiSrcIndex,
    webServer,
    webPackageJson,
    webNextConfig,
    webTsconfig,
    webTsconfigServer,
    turboJson,
  ],
  overrides: [
    { file: "apps/api/package.json", from: "api" },
    { file: "apps/web/next.config.js", from: "web" },
    { file: "apps/web/package.json", from: "web" },
    { file: "apps/web/tsconfig.json", from: "web" },
    { file: "turbo.json", from: "root" },
  ],
};

export default singleProcessCustomServer;
