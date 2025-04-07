import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import testingLibrary from 'eslint-plugin-testing-library'
import jestDom from 'eslint-plugin-jest-dom'
import reactPlugin from 'eslint-plugin-react' // React 플러그인 추가

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      react: reactPlugin, // React 플러그인 등록
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 공통
      'template-curly-spacing': ['error', 'never'],
      'prettier/prettier': 0,
      semi: 0,
      '@typescript-eslint/semi': 0,
      'arrow-parens': ['error', 'as-needed'],
      'no-await-in-loop': 'off',
      'no-plusplus': 'off',
      'object-property-newline': ['off', { allowAllPropertiesOnSameLine: true }],
      'max-len': ['warn', { code: 120 }],
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'prefer-const': 'off',

      // 사용하지 않는 import 감지 설정 추가
      'no-unused-vars': 'off', // 기본 규칙 비활성화
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // TypeScript 버전으로 대체
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // front 전용설정
      'import/extensions': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-unused-expressions': 'off',
      'no-use-before-define': 'off',
      'no-nested-ternary': 'off',
      'no-return-assign': ['error', 'except-parens'],
      'nonblock-statement-body-position': ['error', 'beside', { overrides: { while: 'below' } }],
      camelcase: 'off',
      'consistent-return': 'warn',
      'comma-dangle': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      'arrow-body-style': 'off',
      'global-require': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/no-use-before-define': ['warn', { variables: false }],
      '@typescript-eslint/no-unused-expressions': ['warn', { allowShortCircuit: true, allowTernary: true }],
      'react/function-component-definition': [2, { namedComponents: ['arrow-function', 'function-declaration'] }],
      'react/no-unstable-nested-components': 'warn',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'import/no-unresolved': 'off',
    },
  },
]
