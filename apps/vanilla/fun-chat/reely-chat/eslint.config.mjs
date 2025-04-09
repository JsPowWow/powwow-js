import baseConfig from '../../../../eslint.base.config.mjs';

export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {
      'max-lines-per-function': 'off',
      'unicorn/no-useless-undefined': 'off'
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
