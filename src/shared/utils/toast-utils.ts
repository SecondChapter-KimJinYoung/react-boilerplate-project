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
