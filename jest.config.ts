import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '/migrations/',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  testTimeout: 30000, // 30 seconds timeout for tests
  verbose: true,
};

export default config;
