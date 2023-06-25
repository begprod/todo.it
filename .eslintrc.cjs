/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'quotes': ['error', 'single'],
    'no-multiple-empty-lines': 'error',
    'semi': ['error', 'always'],
  }
};
