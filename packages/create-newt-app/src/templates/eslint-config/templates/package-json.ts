export default {
  filename: "packages/eslint-config/package.json",
  template: `{
  "name": "@<%= projectName %>/eslint-config",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "exports": {
    "./base": "./base.js",
    "./next-js": "./next.js",
    "./react-internal": "./react-internal.js"
  },
  "devDependencies": {
    "@eslint/js": "<%= versions["@eslint/js"] %>",
    "@next/eslint-plugin-next": "<%= versions["@next/eslint-plugin-next"] %>",
    "eslint": "<%= versions.eslint %>",
    "eslint-config-prettier": "<%= versions["eslint-config-prettier"] %>",
    "eslint-plugin-only-warn": "<%= versions["eslint-plugin-only-warn"] %>",
    "eslint-plugin-react": "<%= versions["eslint-plugin-react"] %>",
    "eslint-plugin-react-hooks": "<%= versions["eslint-plugin-react-hooks"] %>",
    "eslint-plugin-turbo": "<%= versions["eslint-plugin-turbo"] %>",
    "globals": "<%= versions.globals %>",
    "typescript": "<%= versions.typescript %>",
    "typescript-eslint": "<%= versions["typescript-eslint"] %>"
  }
}`,
};
