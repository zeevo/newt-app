export default {
  filename: "packages/ui/eslint.config.mjs",
  template: `import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default config;`,
};
