import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy } from 'react';

// default export → named export 순으로 fallback하여 다양한 export 방식에 대응
export const lazyImport = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default?: T; [key: string]: T | undefined }>,
  exportName?: string,
): LazyExoticComponent<T> => {
  return lazy(async () => {
    const module = await importFn();

    if (exportName) {
      const component = exportName === 'default' ? module.default : module[exportName];
      if (!component) {
        throw new Error(`Export "${exportName}" not found in module`);
      }
      return { default: component };
    }

    if (module.default) {
      return { default: module.default };
    }

    const firstExport = Object.values(module)[0] as T | undefined;
    if (firstExport) {
      return { default: firstExport };
    }

    throw new Error('No export found in module');
  });
};
