import type { Module } from "../types";
import { versions } from "../versions";
import oxlintrc from "./templates/oxlintrc";
import oxfmtrc from "./templates/oxfmtrc";

const root = "";

// oxlint reads the nearest config per file and covers the whole tree in one
// pass, so it runs once from the root rather than as a task per workspace.
const oxc: Module = {
  templates: [oxlintrc, oxfmtrc],
  packages: [
    { package: "oxlint", module: root, version: versions.oxlint, dev: true },
    { package: "oxfmt", module: root, version: versions.oxfmt, dev: true },
  ],
  scripts: [
    { module: root, name: "lint", script: "oxlint --fix" },
    { module: root, name: "lint:check", script: "oxlint" },
    { module: root, name: "format", script: "oxfmt" },
    { module: root, name: "format:check", script: "oxfmt --check" },
  ],
};

export default oxc;
