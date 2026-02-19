/**
 * 토스트 알림 유틸리티
 *
 * CustomEvent 기반으로 어디서든 토스트를 호출할 수 있습니다.
 * Toast 컴포넌트가 이벤트를 구독하여 UI를 렌더링합니다.
 *
 * @example
 * showToast({ message: '저장되었습니다.', variant: 'success' });
 * showToast({ message: '오류가 발생했습니다.', variant: 'error' });
 */

export type ToastVariant = 'success' | 'error' | 'warning';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export const TOAST_EVENT = 'app:toast';

export const showToast = (options: ToastOptions) => {
  window.dispatchEvent(
    new CustomEvent<ToastOptions>(TOAST_EVENT, {
      detail: options,
    }),
  );
};
