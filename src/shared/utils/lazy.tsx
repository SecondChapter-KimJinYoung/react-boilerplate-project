/**
 * Lazy Loading 유틸리티
 *
 * 페이지 컴포넌트의 lazy import를 관리합니다.
 * 코드 스플리팅과 타입 안전성을 보장합니다.
 * Suspense는 레이아웃 컴포넌트에서 최상단에 한 번만 적용됩니다.
 * default export와 named export를 자동으로 감지합니다.
 */

import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * 페이지 컴포넌트를 lazy import로 변환
 * default export를 우선 시도하고, 없으면 named export를 시도합니다.
 * @param importFn - 동적 import 함수
 * @param exportName - named export 이름 (선택, 지정 시 해당 export만 시도)
 * @returns LazyExoticComponent
 */
export const lazyImport = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default?: T; [key: string]: T | undefined }>,
  exportName?: string,
): LazyExoticComponent<T> => {
  return lazy(async () => {
    const module = await importFn();

    // exportName이 지정된 경우 해당 export만 시도
    if (exportName) {
      const component = exportName === 'default' ? module.default : module[exportName];
      if (!component) {
        throw new Error(`Export "${exportName}" not found in module`);
      }
      return { default: component };
    }

    // exportName이 없으면 default export 우선 시도
    if (module.default) {
      return { default: module.default };
    }

    // default가 없으면 첫 번째 named export 시도
    const firstExport = Object.values(module)[0] as T | undefined;
    if (firstExport) {
      return { default: firstExport };
    }

    throw new Error('No export found in module');
  });
};
