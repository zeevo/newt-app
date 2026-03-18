import type { Module } from "../types";
import packageJson from "./templates/package-json";
import button from "./templates/button";
import card from "./templates/card";
import code from "./templates/code";
import link from "./templates/link";
import utils from "./templates/utils";
import tsconfig from "./templates/tsconfig";
import eslintConfig from "./templates/eslint-config";

const ui: Module = {
  templates: [packageJson, button, card, code, link, utils, tsconfig, eslintConfig],
};

export default ui;
