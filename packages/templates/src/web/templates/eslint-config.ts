export default {
  filename: "apps/web/eslint.config.js",
  template: `import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default nextJsConfig;`,
};
