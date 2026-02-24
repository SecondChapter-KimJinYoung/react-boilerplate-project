/**
 * 토스트 알림 컴포넌트
 *
 * CustomEvent 기반으로 전역에서 호출 가능한 토스트 알림입니다.
 * showToast()를 통해 어디서든 토스트를 발행하면 이 컴포넌트가 렌더링합니다.
 */

import { useCallback, useEffect, useState } from 'react';
import { TOAST_EVENT } from '@/shared/utils/toast.utils';
import type { ToastOptions, ToastVariant } from '@/shared/utils/toast.utils';
import { cn } from '@/shared/utils/cn';

interface InternalToast extends ToastOptions {
  id: string;
  open: boolean;
}

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
};

const variantIcons: Record<ToastVariant, string> = {
  success: '\u2713',
  error: '\u2715',
  warning: '\u0021',
};

// ============ ToastItem — 개별 토스트의 타이머를 독립 관리 ============

interface ToastItemProps {
  toast: InternalToast;
  onClose: (id: string) => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const variant = toast.variant ?? 'warning';

  // 각 토스트가 자체 타이머를 관리 — 다른 토스트의 상태 변화에 영향받지 않음
  useEffect(() => {
    if (!toast.open) return;
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 3200);
    return () => clearTimeout(timer);
  }, [toast.id, toast.open, toast.duration, onClose]);

  return (
    <div
      className={cn(
        'pointer-events-auto flex min-w-[280px] max-w-sm items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300',
        variantStyles[variant],
        toast.open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      )}
    >
      {/* 아이콘 */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
        {variantIcons[variant]}
      </span>

      {/* 메시지 */}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
      >
        <span className="text-sm">{'\u2715'}</span>
      </button>
    </div>
  );
};

// ============ Toast 컨테이너 ============

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

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-3 p-6">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
};

export default Toast;
