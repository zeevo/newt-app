export default {
  filename: "packages/auth/tsconfig.json",
  template: `{
  "extends": "@<%= projectName %>/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "strictNullChecks": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
};
