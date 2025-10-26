/**
 * Generated companion CJS Jest config to avoid ts-node compile issues when running Jest in dev environments.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Map workspace packages to local source folders so tests can require package imports
    '^@abimongo/(.*)$': '<rootDir>/../$1/src',
  },
  testTimeout: 30000,
};
