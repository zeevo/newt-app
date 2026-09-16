export default {
  filename: ".oxlintrc.json",
  template: `{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "categories": {
    "correctness": "error"
  }<% if (antiSlop) { %>,
  "ignorePatterns": ["tools/oxlint/anti-slop/**"]<% } %><% if (antiSlop || shadcn) { %>,
  "jsPlugins": [<% if (antiSlop) { %>{ "name": "anti-slop", "specifier": "./tools/oxlint/anti-slop/index.ts" }<% } %><% if (antiSlop && shadcn) { %>, <% } %><% if (shadcn) { %>"@shadcn/lint"<% } %>],
  "rules": {<% if (antiSlop) { %>
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-module-mocking": "error",
    "anti-slop/no-object-parameters": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-runtime-typeof": "error",
    "anti-slop/no-shape-in-symbol-names": "error",
    "anti-slop/no-unknown-parameters": "error",
    "anti-slop/no-unknown-returns": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/require-safety-comment-for-type-assertion": "error"<% if (shadcn) { %>,<% } %><% } %><% if (shadcn) { %>
    "shadcn/no-restyle": ["error", { "allow": ["layout"] }],
    "shadcn/no-raw-colors": "error",
    "shadcn/no-arbitrary-values": ["error", { "allow": ["layout"] }],
    "shadcn/require-static-classes": "error"<% } %>
  }<% } %><% if (shadcn) { %>,
  "overrides": [
    {
      "files": ["packages/ui/src/components/**"],
      "rules": {<% if (antiSlop) { %>
        "anti-slop/no-chained-type-assertions": "off",
        "anti-slop/no-conditional-empty-object-spread": "off",
        "anti-slop/no-known-value-widening": "off",
        "anti-slop/no-module-mocking": "off",
        "anti-slop/no-object-parameters": "off",
        "anti-slop/no-reflect-apply": "off",
        "anti-slop/no-reflect-get": "off",
        "anti-slop/no-runtime-typeof": "off",
        "anti-slop/no-shape-in-symbol-names": "off",
        "anti-slop/no-unknown-parameters": "off",
        "anti-slop/no-unknown-returns": "off",
        "anti-slop/no-unknown-type-aliases": "off",
        "anti-slop/no-unsafe-dictionary-type": "off",
        "anti-slop/no-widen-then-assert": "off",
        "anti-slop/require-safety-comment-for-type-assertion": "off",<% } %>
        "shadcn/no-restyle": "off",
        "shadcn/no-arbitrary-values": "off",
        "shadcn/require-static-classes": "off"
      }
    }
  ]<% } %>
}`,
};
