import type { Module } from "../types";
import { versions } from "../versions";
import oxlintrc from "./templates/oxlintrc";
import oxfmtrc from "./templates/oxfmtrc";

const web = "apps/web";
const api = "apps/api";
const ui = "packages/ui";
const root = "";

const oxc: Module = {
  templates: [oxlintrc, oxfmtrc],
  packages: [
    { package: "oxlint", module: web, version: versions.oxlint, dev: true },
    { package: "oxlint", module: api, version: versions.oxlint, dev: true },
    { package: "oxlint", module: ui, version: versions.oxlint, dev: true },
    { package: "oxfmt", module: root, version: versions.oxfmt, dev: true },
  ],
  scripts: [
    {
      module: web,
      name: "lint",
      script: "oxlint --fix && next typegen && tsc --noEmit",
    },
    {
      module: web,
      name: "lint:check",
      script: "oxlint && next typegen && tsc --noEmit",
    },
    { module: api, name: "lint", script: "oxlint src --fix" },
    { module: api, name: "lint:check", script: "oxlint src" },
    { module: ui, name: "lint", script: "oxlint --fix" },
    { module: ui, name: "lint:check", script: "oxlint" },
    { module: root, name: "format", script: "oxfmt" },
    { module: root, name: "format:check", script: "oxfmt --check" },
  ],
};

export default oxc;
