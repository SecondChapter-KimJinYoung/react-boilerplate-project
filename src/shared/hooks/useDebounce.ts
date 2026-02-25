import { useEffect, useState } from 'react';

/**
 * 값 변경 후 일정 시간(delay)이 지나야 반영되는 디바운스 훅.
 * 검색 입력 등에서 API 호출 빈도를 줄일 때 사용.
 */
const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
