import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

import { AppRouter } from '@/routes/router';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import LoadingState from '@/shared/components/molecules/LoadingState';
import Toast from '@/shared/components/organisms/Toast';
import { GC_TIME } from '@/shared/constants/query-config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: GC_TIME.DEFAULT,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingState className="m-16" />}>
          <AppRouter />
        </Suspense>
      </ErrorBoundary>

      <Toast />

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
