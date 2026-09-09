// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules', 'lib/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    extends: [js.configs.recommended, prettierRecommended, prettier],
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          useTabs: false,
          tabWidth: 2,
          singleQuote: true,
          semi: true,
          preserve: 'preserve',
          objectWrapping: 'collapse',
          arrowParens: 'avoid',
          printWidth: 120,
          parser: 'typescript',
        },
        {
          usePrettierrc: false,
          fileInfoOptions: {
            withNodeModules: true,
          },
        },
      ],
      'func-style': [
        'warn',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ],
      'require-await': 'error',
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],
      'no-throw-literal': 'warn',
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      prettierRecommended,
      prettier,
    ],
    rules: {
      'prettier/prettier': [
        'error',
        {
          useTabs: false,
          tabWidth: 2,
          singleQuote: true,
          semi: true,
          preserve: 'preserve',
          objectWrapping: 'collapse',
          arrowParens: 'avoid',
          printWidth: 120,
          parser: 'typescript',
        },
        {
          usePrettierrc: false,
          fileInfoOptions: {
            withNodeModules: true,
          },
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          prefix: ['E'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'func-style': [
        'warn',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ],
      'require-await': 'error',
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],
      'no-throw-literal': 'warn',
    },
  },
]);
