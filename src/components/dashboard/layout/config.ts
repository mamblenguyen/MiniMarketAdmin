import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'categories', title: 'Danh mục sản phẩm', href: paths.dashboard.categories, icon: 'chart-pie' },
  { key: 'brands', title: 'Thương hiệu', href: paths.dashboard.brands, icon: 'chart-pie' },
  { key: 'supplier', title: 'Nhà cung ứng', href: paths.dashboard.supplier, icon: 'chart-pie' },
  { key: 'variant', title: 'Biến thể', href: paths.dashboard.variant, icon: 'chart-pie' },
  { key: 'products', title: 'Sản phẩm', href: paths.dashboard.products, icon: 'chart-pie' },
  { key: 'orders', title: 'Đặt mua', href: paths.dashboard.order, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
