import type { Module } from "../types";
import packageJson from "./templates/package-json";
import base from "./templates/base";
import next from "./templates/next";
import reactInternal from "./templates/react-internal";

const eslintConfig: Module = {
  templates: [packageJson, base, next, reactInternal],
};

export default eslintConfig;
