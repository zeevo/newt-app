import type { Module } from "../types";
import packageJson from "./templates/package-json";
import button from "./templates/button";
import card from "./templates/card";
import code from "./templates/code";
import link from "./templates/link";
import logo from "./templates/logo";
import utils from "./templates/utils";
import globalsCss from "./templates/globals-css";
import postcssConfig from "./templates/postcss-config";
import tsconfig from "./templates/tsconfig";
import eslintConfig from "./templates/eslint-config";

const ui: Module = {
  templates: [packageJson, button, card, code, link, logo, utils, globalsCss, postcssConfig, tsconfig, eslintConfig],
};

export default ui;
