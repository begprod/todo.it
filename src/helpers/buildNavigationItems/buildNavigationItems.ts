import type { RouteRecordRaw } from 'vue-router';
import type { IMenuItem } from '@/types';

export const buildNavigationItems = (
  routes: readonly RouteRecordRaw[],
  parentPath = '',
): IMenuItem[] =>
  routes.reduce<IMenuItem[]>((items, route) => {
    if (!route.name || !route.meta || route.meta.isHidden) return items;

    const path = route.path ?? '';
    const to = parentPath ? `${parentPath}/${path.replace(/^\//, '')}`.replace(/\/+$/, '') : path;

    items.push({ name: String(route.name), to, title: route.meta.navTitle, icon: route.meta.icon });

    return items;
  }, []);
