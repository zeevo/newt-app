import type { Config } from 'jest';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    // Under nodenext ts-jest follows each package's "type", so it would emit
    // packages/db as ESM, which jest's CommonJS runtime can't require
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: { module: 'commonjs' } }],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@thallesp/nestjs-better-auth$': '<rootDir>/../__mocks__/@thallesp/nestjs-better-auth.js',
  },
} satisfies Config;