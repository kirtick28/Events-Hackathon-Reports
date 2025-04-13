import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.es2020
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
