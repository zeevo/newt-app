import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "bare",
  filename: "apps/web/jest.config.ts",
  template: `import type { Config } from 'jest';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '__tests__/.*\\\\.spec\\\\.ts$',
  transform: {
    // rootDir is set explicitly because ts-jest only ever compiles the spec
    // files, and TypeScript infers the common source directory from those.
    '^.+\\\\.(t|j)s$': [
      'ts-jest',
      { useESM: true, tsconfig: { rootDir: '.' } },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
} satisfies Config;`,
};
