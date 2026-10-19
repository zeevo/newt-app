export default {
  filename: "apps/api/__mocks__/better-auth.js",
  template: `// Mock for better-auth — ESM-only package, incompatible with ts-jest CJS mode
module.exports = {
  betterAuth: () => ({}),
};
`,
};
