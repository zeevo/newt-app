export default {
  filename: "apps/api/tsconfig.build.json",
  template: `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}`,
};
