import type { Module } from "../types";
import packageJson from "./templates/package-json";
import srcIndex from "./templates/src-index";
import tsconfig from "./templates/tsconfig";

const auth: Module = {
  templates: [packageJson, srcIndex, tsconfig],
};

export default auth;
