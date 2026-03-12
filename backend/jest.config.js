module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  // TODO(issue): Re-expand coverage scope after broader backend TypeScript issues are resolved.
  collectCoverageFrom: [
    'src/controllers/errors.ts',
    'src/utils/jwt.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/**/__tests__/**',
    '!src/**/tests/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};