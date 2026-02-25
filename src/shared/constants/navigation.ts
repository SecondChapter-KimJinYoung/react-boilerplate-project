import { ROUTES } from '@/routes/routes';

export interface NavItem {
  label: string;
  to: string;
  devOnly?: boolean;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: '대시보드', to: ROUTES.DASHBOARD },
  { label: 'Example', to: ROUTES.EXAMPLE.LIST, devOnly: true },
];
