import type { Module } from "../types";
import { versions } from "../versions";
import pluginPackageJson from "./templates/plugin-package-json";

const plugin = "tools/oxlint/anti-slop";

// Upstream publishes nothing to npm, and oxlint needs the directory marked ESM.
const antiSlop: Module = {
  templates: [pluginPackageJson],
  staticFiles: [
    { src: "anti-slop/static/LICENSE", filename: `${plugin}/LICENSE` },
    { src: "anti-slop/static/index.ts", filename: `${plugin}/index.ts` },
    {
      src: "anti-slop/static/rules/no-array-filter-map.ts",
      filename: `${plugin}/rules/no-array-filter-map.ts`,
    },
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
      src: "anti-slop/static/rules/no-reduce-accumulator-copy.ts",
      filename: `${plugin}/rules/no-reduce-accumulator-copy.ts`,
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
      src: "anti-slop/static/rules/require-readable-spacing.ts",
      filename: `${plugin}/rules/require-readable-spacing.ts`,
    },
    {
      src: "anti-slop/static/rules/require-safety-comment-for-type-assertion.ts",
      filename: `${plugin}/rules/require-safety-comment-for-type-assertion.ts`,
    },
    {
      src: "anti-slop/static/shared/array-method.ts",
      filename: `${plugin}/shared/array-method.ts`,
    },
    {
      src: "anti-slop/static/shared/dictionary-types.ts",
      filename: `${plugin}/shared/dictionary-types.ts`,
    },
    {
      src: "anti-slop/static/shared/function-parameters.ts",
      filename: `${plugin}/shared/function-parameters.ts`,
    },
    {
      src: "anti-slop/static/shared/lexical-type-parameters.ts",
      filename: `${plugin}/shared/lexical-type-parameters.ts`,
    },
    {
      src: "anti-slop/static/shared/reflect-method.ts",
      filename: `${plugin}/shared/reflect-method.ts`,
    },
    { src: "anti-slop/static/shared/scope.ts", filename: `${plugin}/shared/scope.ts` },
    {
      src: "anti-slop/static/shared/type-alias-resolution.ts",
      filename: `${plugin}/shared/type-alias-resolution.ts`,
    },
    {
      src: "anti-slop/static/vendor/eslint-stylistic/LICENSE",
      filename: `${plugin}/vendor/eslint-stylistic/LICENSE`,
    },
    {
      src: "anti-slop/static/vendor/eslint-stylistic/UPSTREAM.md",
      filename: `${plugin}/vendor/eslint-stylistic/UPSTREAM.md`,
    },
    {
      src: "anti-slop/static/vendor/eslint-stylistic/padding-line-ast.ts",
      filename: `${plugin}/vendor/eslint-stylistic/padding-line-ast.ts`,
    },
    {
      src: "anti-slop/static/vendor/eslint-stylistic/padding-line-between-statements.ts",
      filename: `${plugin}/vendor/eslint-stylistic/padding-line-between-statements.ts`,
    },
    {
      src: "anti-slop/static/vendor/eslint-stylistic/padding-line-options.d.ts",
      filename: `${plugin}/vendor/eslint-stylistic/padding-line-options.d.ts`,
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
