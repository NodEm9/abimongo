module.exports = {
  root: true,
  ignorePatterns: ['**/dist/**', '**/build/**', '**/.next/**', '**/coverage/**'],
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', project: false },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    { files: ['**/*.ts', '**/*.tsx'], rules: {} },
  ],
};
