/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Vitest 테스트 설정
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },

  // Vite 플러그인 설정
  plugins: [
    // React 플러그인: Fast Refresh, JSX 변환 등
    react(),

    // Tailwind CSS 플러그인: 유틸리티 기반 CSS 프레임워크
    tailwindcss(),

    // TypeScript + ESLint 실시간 체크 플러그인
    // 개발 서버 실행 시 에러를 터미널 + 화면 오버레이에 표시
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
        buildMode: false,
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint src',
      },
      overlay: {
        initialIsOpen: true, // 에러 발생 시 즉시 오버레이 표시
        position: 'tl',
        badgeStyle: 'position: fixed; top: 20px; right: 20px; z-index: 9999;',
      },
      terminal: true,
    }),
  ],

  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 개발 서버 설정
  server: {
    port: 5173,
    open: true,
    host: true, // 네트워크 접근 가능 (모바일 디바이스 테스트용)
    // HMR 연결 실패 시 자동 재연결
    hmr: {
      overlay: true, // 에러 발생 시 화면에 오버레이 표시
    },
    // 에러 출력 설정
    strictPort: false, // 포트가 사용 중이면 다른 포트 사용
  },

  // 개발 중 캐시 무효화 방지
  optimizeDeps: {
    // 의존성 변경 시 자동 재빌드
    force: false,
  },

  // 빌드 설정
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        // 코드 스플리팅: vendor/deps 분리로 초기 로딩 최적화
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            return 'deps'
          }
        },
        // 파일명에 해시 포함하여 캐시 무효화 (배포 후 변경사항 즉시 반영)
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
