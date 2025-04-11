import baseConfig from '../../../../eslint.base.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'unicorn/prefer-module': 'off',
      'max-lines-per-function': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-array-find': 'off',
      'unicorn/no-for-loop': 'off',
    },
  },
];
