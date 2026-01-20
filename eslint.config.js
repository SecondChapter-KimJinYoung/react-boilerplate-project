// ESLint 설정 파일
// 코드 품질 검사 및 Prettier 통합 설정

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 검사 제외할 파일/디렉토리
  globalIgnores(['dist', 'vite.config.ts', '*.config.ts', '*.config.js']),

  // Prettier와 충돌하는 ESLint 규칙 비활성화 (flat config에서는 배열에 직접 추가)
  prettierConfig,

  {
    // 검사 대상 파일
    files: ['src/**/*.{ts,tsx}'],

    // 기본 규칙 확장
    extends: [
      js.configs.recommended, // JavaScript 권장 규칙
      ...tseslint.configs.recommended, // TypeScript 권장 규칙
      reactHooks.configs.flat.recommended, // React Hooks 규칙
      reactRefresh.configs.vite, // React Refresh 규칙
    ],

    // 언어 옵션 설정
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser, // TypeScript 파서 사용
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json', // TypeScript 프로젝트 설정 참조 (타입 기반 규칙 활성화)
        ecmaFeatures: {
          jsx: true, // JSX 지원
        },
      },
    },

    // 플러그인 설정
    plugins: {
      react, // React 규칙
      prettier, // Prettier 통합
    },

    // 커스텀 규칙
    rules: {
      // React 규칙
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ 에서는 불필요
      'react/prop-types': 'off', // TypeScript 사용 시 불필요

      // 일반 JavaScript 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log는 경고, warn/error는 허용

      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }, // _로 시작하는 변수는 무시
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 명시 불필요
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 모듈 경계 타입 명시 불필요
      '@typescript-eslint/no-floating-promises': 'warn', // 처리되지 않은 Promise 경고
      '@typescript-eslint/no-empty-object-type': 'warn', // 빈 객체 타입 경고

      // React Hooks 규칙
      'react-hooks/exhaustive-deps': 'warn', // 의존성 배열 경고

      // Prettier 규칙 (.prettierrc 파일 참조)
      'prettier/prettier': 'warn', // Prettier 설정 위반 시 경고
    },

    // React 플러그인 설정
    settings: {
      react: {
        version: 'detect', // package.json에서 React 버전 자동 감지
      },
    },
  },
])
