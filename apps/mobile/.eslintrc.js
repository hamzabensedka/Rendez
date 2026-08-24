/** Basic ESLint for the Expo app. Type-aware rules live in each project's tsconfig. */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  env: {
    es2022: true,
    node: true,
  },
  rules: {
    // TypeScript compiler owns these checks.
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    '.cache/',
    'babel.config.js',
    'jest.config.cjs',
    'metro.config.js',
  ],
};
