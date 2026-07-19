export default {
  filename: "packages/ui/components.json",
  template: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@<%= projectName %>/ui/components",
    "utils": "@<%= projectName %>/ui/lib/utils",
    "hooks": "@<%= projectName %>/ui/hooks",
    "lib": "@<%= projectName %>/ui/lib",
    "ui": "@<%= projectName %>/ui/components"
  }
}`,
};
