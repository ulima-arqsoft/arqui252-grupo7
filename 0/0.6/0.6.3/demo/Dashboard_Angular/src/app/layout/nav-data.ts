export interface NavItem {
  title: string;
  path: string;
  icon: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Panel',
    path: '/',
    icon: '📊'
  },
  {
    title: 'Productos',
    path: '/products',
    icon: '🛍️'
  }
];
