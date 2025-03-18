import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const MAX_LINES_PER_FUNCTION = 55;

export default [
  {
    ignores: ['**/dist', 'vite.config.*', 'eslint.config.*', 'playwright.config.*'],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
      },
    })),
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'unicorn/better-regex': 'warn',
      semi: ['error', 'always'],
      'max-lines-per-function': ['error', MAX_LINES_PER_FUNCTION],
    },
  },
  {
    rules: {
      'unicorn/prefer-event-target': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-map': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkFilenames: false,
          allowList: {
            acc: true,
            env: true,
            i: true,
            j: true,
            props: true,
            Props: true,
          },
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '[iI]gnored',
        },
      ],
      'unicorn/filename-case': 'off',
    },
  },
];
