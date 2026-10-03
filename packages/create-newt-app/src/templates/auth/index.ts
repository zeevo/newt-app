import type { Module } from "../types";
import packageJson from "./templates/package-json";
import srcCli from "./templates/src-cli";
import srcIndex from "./templates/src-index";
import srcOptions from "./templates/src-options";
import tsconfig from "./templates/tsconfig";

const auth: Module = {
  templates: [packageJson, srcOptions, srcIndex, srcCli, tsconfig],
};

export default auth;
