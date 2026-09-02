import type { Module } from "../types";
import packageJson from "./templates/package-json";
import button from "./templates/button";
import link from "./templates/link";
import logo from "./templates/logo";
import utils from "./templates/utils";
import globalsCss from "./templates/globals-css";
import postcssConfig from "./templates/postcss-config";
import tsconfig from "./templates/tsconfig";

const ui: Module = {
  templates: [
    packageJson,
    button,
    link,
    logo,
    utils,
    globalsCss,
    postcssConfig,
    tsconfig,
  ],
};

export default ui;
