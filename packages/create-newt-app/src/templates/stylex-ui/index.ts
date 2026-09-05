import type { Module } from "../types";
import tsconfig from "../ui/templates/tsconfig";
import packageJson from "./templates/package-json";
import tokens from "./templates/tokens";
import button from "./templates/button";
import link from "./templates/link";
import logo from "./templates/logo";
import globalsCss from "./templates/globals-css";
import webPackageJson from "./templates/web-package-json";
import webPackageJsonDi from "./templates/web-package-json-di";
import babelConfig from "./templates/babel-config";
import postcssConfig from "./templates/postcss-config";
import layout from "./templates/layout";
import page from "./templates/page";
import authForm from "./templates/auth-form";

// StyleX compiles styles out of the source that authors them, so the app owns
// the babel and postcss config: the include globs have to reach back into
// packages/ui, and Next's babel loader only reads a config next to the app.
const stylexUi: Module = {
  templates: [
    packageJson,
    tokens,
    button,
    link,
    logo,
    globalsCss,
    tsconfig,
    webPackageJson,
    webPackageJsonDi,
    babelConfig,
    postcssConfig,
    layout,
    page,
    authForm,
  ],
};

export default stylexUi;
