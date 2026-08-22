export default {
  filename: "apps/api/jest.config.ts",
  template: `import type { Config } from 'jest';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\\\.spec\\\\.ts$',
  transform: {
    '^.+\\\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@thallesp/nestjs-better-auth$': '<rootDir>/../__mocks__/@thallesp/nestjs-better-auth.js',
  },
} satisfies Config;`,
};
