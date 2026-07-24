import type { Module } from "../types";
import packageJson from "./templates/package-json";
import base from "./templates/base";
import next from "./templates/next";
import reactInternal from "./templates/react-internal";
import webConfig from "../web/templates/eslint-config";
import apiConfig from "../api/templates/eslint-config";
import uiConfig from "../ui/templates/eslint-config";

const web = "apps/web";
const api = "apps/api";
const ui = "packages/ui";
const root = "";

const eslintConfig: Module = {
  templates: [packageJson, base, next, reactInternal, webConfig, apiConfig, uiConfig],
  packages: [
    { package: "eslint", module: web, version: "^9.39.1", dev: true },
    { package: "@<%= projectName %>/eslint-config", module: web, version: "workspace:*", dev: true },
    { package: "@eslint/eslintrc", module: api, version: "^3.2.0", dev: true },
    { package: "@eslint/js", module: api, version: "^9.18.0", dev: true },
    { package: "eslint", module: api, version: "^9.18.0", dev: true },
    { package: "eslint-config-prettier", module: api, version: "^10.0.1", dev: true },
    { package: "globals", module: api, version: "^16.0.0", dev: true },
    { package: "typescript-eslint", module: api, version: "^8.20.0", dev: true },
    { package: "eslint", module: ui, version: "^9.39.1", dev: true },
    { package: "@<%= projectName %>/eslint-config", module: ui, version: "workspace:*", dev: true },
    { package: "prettier", module: root, version: "^3.7.4", dev: true },
  ],
  scripts: [
    { module: web, name: "lint", script: "eslint --fix && next typegen && tsc --noEmit" },
    { module: web, name: "lint:check", script: "eslint --max-warnings 0 && next typegen && tsc --noEmit" },
    { module: api, name: "lint", script: `eslint "src/**/*.ts" --fix` },
    { module: api, name: "lint:check", script: `eslint "src/**/*.ts"` },
    { module: ui, name: "lint", script: "eslint . --fix" },
    { module: ui, name: "lint:check", script: "eslint . --max-warnings 0" },
    { module: root, name: "format", script: `prettier --write "**/*.{ts,tsx,js,jsx,json,md,yaml,yml}"` },
    { module: root, name: "format:check", script: `prettier --check "**/*.{ts,tsx,js,jsx,json,md,yaml,yml}"` },
  ],
};

export default eslintConfig;
