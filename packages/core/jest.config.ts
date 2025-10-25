/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} **/


import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@abimongo/(.*)$': '<rootDir>/node_modules/@abimongo/$1',
  },
  testTimeout: 30000, // 30 seconds
};

export default config;
