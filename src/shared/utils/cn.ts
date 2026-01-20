import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * className을 합치고 Tailwind 클래스 충돌을 자동으로 해결하는 유틸리티 함수
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-2가 px-4로 덮어씌워짐)
 * cn('text-red-500', isActive && 'text-blue-500') // 조건부 클래스
 * cn('base-class', className) // props로 받은 className과 합치기
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
