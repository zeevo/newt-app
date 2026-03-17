export default {
  filename: "packages/typescript-config/package.json",
  template: `{
  "name": "@<%= projectName %>/typescript-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  }
}`,
};
