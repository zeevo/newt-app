export default {
  filename: "apps/web/eslint.config.js",
  template: `import { nextJsConfig } from "@<%= projectName %>/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default nextJsConfig;`,
};
