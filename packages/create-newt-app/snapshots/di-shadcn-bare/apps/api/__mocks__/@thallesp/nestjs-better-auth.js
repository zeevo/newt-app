// Mock for @thallesp/nestjs-better-auth — ESM-only package, incompatible with ts-jest CJS mode
const noop = () => () => {};

class MockAuthModule {}

module.exports = {
  AllowAnonymous: noop,
  RequireAuth: noop,
  Session: noop,
  AuthGuard: class AuthGuard {},
  AuthModule: { forRoot: () => MockAuthModule, forRootAsync: () => MockAuthModule },
};
