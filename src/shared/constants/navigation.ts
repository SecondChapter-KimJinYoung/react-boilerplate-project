/**
 * 사이드바 네비게이션 설정
 *
 * DashboardLayout에서 사용하는 메뉴 항목을 중앙에서 관리합니다.
 * 새 도메인 추가 시 이 배열에 항목을 추가하세요.
 */

import { ROUTES } from '@/routes/routes';

export interface NavItem {
  /** 메뉴 표시 이름 */
  label: string;
  /** 라우트 경로 */
  to: string;
  /** 개발 모드에서만 표시 (기본값: false) */
  devOnly?: boolean;
  // 향후 확장: roles?: ('admin' | 'user')[];
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: '대시보드', to: ROUTES.DASHBOARD },
  { label: 'Example', to: ROUTES.EXAMPLE.LIST, devOnly: true },
];
