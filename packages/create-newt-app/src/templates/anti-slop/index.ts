import type { Module } from "../types";
import { versions } from "../versions";
import pluginPackageJson from "./templates/plugin-package-json";
import pluginReadme from "./templates/plugin-readme";

const plugin = "tools/oxlint/anti-slop";

// Upstream publishes nothing to npm: the rules are meant to be copied in and
// edited, so they ship as static files rather than a dependency. `.oxlintrc.json`
// registers them (see the oxc module) and `package.json` marks the directory ESM
// so oxlint loads the plugin without reparsing it.
const antiSlop: Module = {
  templates: [pluginPackageJson, pluginReadme],
  staticFiles: [
    { src: "anti-slop/static/LICENSE", filename: `${plugin}/LICENSE` },
    { src: "anti-slop/static/index.ts", filename: `${plugin}/index.ts` },
    {
      src: "anti-slop/static/rules/no-chained-type-assertions.ts",
      filename: `${plugin}/rules/no-chained-type-assertions.ts`,
    },
    {
      src: "anti-slop/static/rules/no-conditional-empty-object-spread.ts",
      filename: `${plugin}/rules/no-conditional-empty-object-spread.ts`,
    },
    {
      src: "anti-slop/static/rules/no-known-value-widening.ts",
      filename: `${plugin}/rules/no-known-value-widening.ts`,
    },
    {
      src: "anti-slop/static/rules/no-module-mocking.ts",
      filename: `${plugin}/rules/no-module-mocking.ts`,
    },
    {
      src: "anti-slop/static/rules/no-object-parameters.ts",
      filename: `${plugin}/rules/no-object-parameters.ts`,
    },
    {
      src: "anti-slop/static/rules/no-reflect-apply.ts",
      filename: `${plugin}/rules/no-reflect-apply.ts`,
    },
    {
      src: "anti-slop/static/rules/no-reflect-get.ts",
      filename: `${plugin}/rules/no-reflect-get.ts`,
    },
    {
      src: "anti-slop/static/rules/no-runtime-typeof.ts",
      filename: `${plugin}/rules/no-runtime-typeof.ts`,
    },
    {
      src: "anti-slop/static/rules/no-shape-in-symbol-names.ts",
      filename: `${plugin}/rules/no-shape-in-symbol-names.ts`,
    },
    {
      src: "anti-slop/static/rules/no-unknown-parameters.ts",
      filename: `${plugin}/rules/no-unknown-parameters.ts`,
    },
    {
      src: "anti-slop/static/rules/no-unknown-returns.ts",
      filename: `${plugin}/rules/no-unknown-returns.ts`,
    },
    {
      src: "anti-slop/static/rules/no-unknown-type-aliases.ts",
      filename: `${plugin}/rules/no-unknown-type-aliases.ts`,
    },
    {
      src: "anti-slop/static/rules/no-unsafe-dictionary-type.ts",
      filename: `${plugin}/rules/no-unsafe-dictionary-type.ts`,
    },
    {
      src: "anti-slop/static/rules/no-widen-then-assert.ts",
      filename: `${plugin}/rules/no-widen-then-assert.ts`,
    },
    {
      src: "anti-slop/static/rules/require-safety-comment-for-type-assertion.ts",
      filename: `${plugin}/rules/require-safety-comment-for-type-assertion.ts`,
    },
    {
      src: "anti-slop/static/shared/dictionary-types.ts",
      filename: `${plugin}/shared/dictionary-types.ts`,
    },
    {
      src: "anti-slop/static/shared/lexical-type-parameters.ts",
      filename: `${plugin}/shared/lexical-type-parameters.ts`,
    },
    {
      src: "anti-slop/static/shared/reflect-method.ts",
      filename: `${plugin}/shared/reflect-method.ts`,
    },
  ],
  packages: [
    {
      package: "@oxlint/plugins",
      module: "",
      version: versions["@oxlint/plugins"],
      dev: true,
    },
  ],
};

export default antiSlop;
