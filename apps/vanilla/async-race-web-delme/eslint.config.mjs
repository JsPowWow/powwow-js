import baseConfig from '../../../eslint.base.config.mjs';

export default [
  {
    ignores: ['**/dist', '**/src/components/*', '**/src/controllers/*', '**/src/helpers/*'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/prefer-global-this': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
