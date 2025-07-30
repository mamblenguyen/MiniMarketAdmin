import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare as XSquareIcon } from '@phosphor-icons/react/dist/ssr/XSquare';
import { Package as PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { ShoppingCart as ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart';
import { Stack as StackIcon } from '@phosphor-icons/react/dist/ssr/Stack';
import { Tag as TagIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { Truck as TruckIcon } from '@phosphor-icons/react/dist/ssr/Truck';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquareIcon,
  user: UserIcon,
  users: UsersIcon,
  'package': PackageIcon,
  'shopping-cart': ShoppingCartIcon,
  'stack': StackIcon,
  'tag': TagIcon,
  'truck': TruckIcon,
} as Record<string, Icon>;
