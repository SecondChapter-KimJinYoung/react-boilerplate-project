import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import type { SlideProps } from '@mui/material/Slide';

type ToastVariant = 'success' | 'error' | 'warning';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface InternalToast extends ToastOptions {
  id: string;
  open: boolean;
}

const TOAST_EVENT = 'app:toast';

// UUID 생성 함수 (crypto.randomUUID 폴백)
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: Date.now() + Math.random() 조합
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (options: ToastOptions) => {
  window.dispatchEvent(
    new CustomEvent<ToastOptions>(TOAST_EVENT, {
      detail: options,
    }),
  );
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const Toast = () => {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  useEffect(() => {
    const handler = (event: CustomEvent<ToastOptions>) => {
      const id = generateId();
      const toast: InternalToast = {
        id,
        variant: 'warning',
        duration: 3200,
        open: true,
        ...event.detail,
      };

      setToasts((prev) => [...prev, toast]);
    };

    window.addEventListener(TOAST_EVENT, handler as EventListener);
    return () => window.removeEventListener(TOAST_EVENT, handler as EventListener);
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={toast.open}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{
            top: `${24 + index * 72}px !important`,
          }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.variant}
            variant="filled"
            sx={{
              minWidth: '280px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontWeight: 500,
              '& .MuiAlert-icon': {
                fontSize: '22px',
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Toast;
