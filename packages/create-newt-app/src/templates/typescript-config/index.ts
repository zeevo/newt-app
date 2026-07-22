import type { Module } from "../types";
import packageJson from "./templates/package-json";
import base from "./templates/base";
import nextjs from "./templates/nextjs";
import reactLibrary from "./templates/react-library";

const typescriptConfig: Module = {
  templates: [packageJson, base, nextjs, reactLibrary],
};

export default typescriptConfig;
