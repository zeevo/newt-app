export default {
  filename: "packages/ui/tsconfig.json",
  template: `{
  "extends": "@<%= projectName %>/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "strictNullChecks": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
};
