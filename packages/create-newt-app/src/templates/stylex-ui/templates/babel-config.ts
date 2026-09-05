export default {
  filename: "apps/web/babel.config.js",
  template: `import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  presets: ["next/babel"],
  plugins: [
<% if (nestDiOnly) { %>    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    ["@babel/plugin-transform-class-properties", { loose: true }],
<% } %>    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        runtimeInjection: false,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir: path.join(dirname, "../.."),
        },
      },
    ],
  ],
};

export default config;`,
};
