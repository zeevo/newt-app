import type { Module } from "../types";
import oxlintrc from "./templates/oxlintrc";
import oxfmtrc from "./templates/oxfmtrc";

const web = "apps/web";
const api = "apps/api";
const ui = "packages/ui";
const root = "";

const oxc: Module = {
  templates: [oxlintrc, oxfmtrc],
  packages: [
    { package: "oxlint", module: web, version: "^1.74.0", dev: true },
    { package: "oxlint", module: api, version: "^1.74.0", dev: true },
    { package: "oxlint", module: ui, version: "^1.74.0", dev: true },
    { package: "oxfmt", module: root, version: "^0.59.0", dev: true },
  ],
  scripts: [
    { module: web, name: "lint", script: "oxlint --fix && next typegen && tsc --noEmit" },
    { module: web, name: "lint:check", script: "oxlint && next typegen && tsc --noEmit" },
    { module: api, name: "lint", script: "oxlint src --fix" },
    { module: api, name: "lint:check", script: "oxlint src" },
    { module: ui, name: "lint", script: "oxlint --fix" },
    { module: ui, name: "lint:check", script: "oxlint" },
    { module: root, name: "format", script: "oxfmt" },
    { module: root, name: "format:check", script: "oxfmt --check" },
  ],
};

export default oxc;
