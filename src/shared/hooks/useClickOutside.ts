import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * ref 요소 바깥 클릭 시 handler를 실행하는 훅.
 * 모달, 드롭다운, 팝오버 닫기에 사용.
 */
const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
