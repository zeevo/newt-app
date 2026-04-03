export default {
  filename: "apps/api/__mocks__/@thallesp/nestjs-better-auth.js",
  template: `// Mock for @thallesp/nestjs-better-auth — used by Jest to avoid ESM parsing issues
const noop = () => () => {};

module.exports = {
  AllowAnonymous: noop,
  RequireAuth: noop,
  Session: noop,
  AuthGuard: class AuthGuard {},
  BetterAuthModule: { forRoot: noop, forRootAsync: noop },
};
`,
};
