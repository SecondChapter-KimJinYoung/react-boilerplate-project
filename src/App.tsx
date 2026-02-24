import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { AppRouter } from '@/routes/router';
import Toast from '@/shared/components/organisms/Toast';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import LoadingState from '@/shared/components/molecules/LoadingState';

// React Query 전역 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 1회 재시도
      refetchOnWindowFocus: false, // 탭 전환 시 자동 refetch 비활성화
      staleTime: 1000 * 60 * 5, // 5분 — 데이터가 fresh로 유지되는 시간
      gcTime: 1000 * 60 * 10, // 10분 — 비활성 캐시 유지 시간 (구 cacheTime)
    },
  },
});

function App() {
  return (
    // React Query 서버 상태 관리 Provider
    <QueryClientProvider client={queryClient}>
      {/* 렌더링 에러 포착 → 대체 UI 표시 */}
      <ErrorBoundary>
        {/* lazy import 로딩 중 fallback UI */}
        <Suspense fallback={<LoadingState className="m-16" />}>
          <AppRouter />
        </Suspense>
      </ErrorBoundary>

      {/* 전역 토스트 알림 (showToast()로 어디서든 호출) */}
      <Toast />

      {/* 개발 모드 전용 — React Query 상태 디버깅 패널 (프로덕션 빌드에 미포함) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
