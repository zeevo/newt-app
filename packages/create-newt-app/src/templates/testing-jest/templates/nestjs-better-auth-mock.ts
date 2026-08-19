import type { Selection } from "../../types";
export default {
  when: (s) => s.mode !== "bare",
  filename: "apps/api/__mocks__/@thallesp/nestjs-better-auth.js",
  template: `// Mock for @thallesp/nestjs-better-auth — ESM-only package, incompatible with ts-jest CJS mode
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
