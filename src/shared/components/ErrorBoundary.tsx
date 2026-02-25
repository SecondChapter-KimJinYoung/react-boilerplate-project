import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

import Button from '@/shared/components/atoms/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.warn('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">오류가 발생했습니다</h2>
            <p className="mt-2 text-sm text-gray-500">
              예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.
            </p>

            {/* 개발 모드에서만 에러 메시지 표시 */}
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-gray-100 p-3 text-left text-xs text-red-600">
                {this.state.error.message}
              </pre>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" onClick={this.handleReset}>
                다시 시도
              </Button>
              <Button onClick={this.handleGoHome}>홈으로 이동</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
