export default {
  filename: "apps/web/components.json",
  template: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@<%= projectName %>/ui/lib/utils",
    "ui": "@<%= projectName %>/ui/components"
  },
  "rtl": false,
  "menuColor": "default",
  "menuAccent": "subtle"
}`,
};
