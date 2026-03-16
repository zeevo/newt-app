import type { Module } from "../types";
import packageJson from "./templates/package-json";
import gitignore from "./templates/gitignore";
import prettierrc from "./templates/prettierrc";
import dockerignore from "./templates/dockerignore";
import npmrc from "./templates/npmrc";
import turboJson from "./templates/turbo-json";
import pnpmWorkspace from "./templates/pnpm-workspace";
import readme from "./templates/readme";
import envExample from "./templates/env-example";

const root: Module = {
  templates: [
    packageJson,
    gitignore,
    prettierrc,
    dockerignore,
    npmrc,
    turboJson,
    pnpmWorkspace,
    readme,
    envExample,
  ],
};

export default root;
