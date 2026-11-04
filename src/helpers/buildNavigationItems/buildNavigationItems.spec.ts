import type { RouteRecordRaw } from 'vue-router';
import { describe, it, expect } from 'vitest';
import { defineComponent } from 'vue';
import { Settings } from 'lucide-vue-next';
import { buildNavigationItems } from '@/helpers/buildNavigationItems/buildNavigationItems';

const Component = defineComponent({});

describe('buildNavigationItems', () => {
  it('should skip hidden routes and routes without a name', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        name: 'home',
        component: Component,
        meta: { navTitle: '_board', isHidden: false },
      },
      {
        path: '/hidden',
        name: 'hidden',
        component: Component,
        meta: { navTitle: 'h', isHidden: true },
      },
      { path: '/anonymous', component: Component, meta: { navTitle: 'a', isHidden: false } },
    ];

    const items = buildNavigationItems(routes);

    expect(items.map((item) => item.name)).toEqual(['home']);
  });

  it('should skip routes without meta', () => {
    const routes: RouteRecordRaw[] = [{ path: '/plain', name: 'plain', component: Component }];

    expect(buildNavigationItems(routes)).toEqual([]);
  });

  it('should keep absolute paths for top-level routes', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/settings',
        name: 'settings',
        component: Component,
        meta: { navTitle: 's', isHidden: false },
      },
    ];

    expect(buildNavigationItems(routes)[0].to).toBe('/settings');
  });

  it('should join parent path with relative child path', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'scopes',
        name: 'settings-scopes',
        component: Component,
        meta: { navTitle: 'Scopes', isHidden: false },
      },
      {
        path: '/labels',
        name: 'settings-labels',
        component: Component,
        meta: { navTitle: 'Labels', isHidden: false },
      },
    ];

    const items = buildNavigationItems(routes, '/settings');

    expect(items.map((item) => item.to)).toEqual(['/settings/scopes', '/settings/labels']);
  });

  it('should not add a trailing slash for an empty child path', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '',
        name: 'settings-index',
        component: Component,
        meta: { navTitle: 'Index', isHidden: false },
      },
    ];

    expect(buildNavigationItems(routes, '/settings')[0].to).toBe('/settings');
  });

  it('should keep title and icon', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/settings',
        name: 'settings',
        component: Component,
        meta: { navTitle: '_settings', isHidden: false, icon: Settings },
      },
    ];

    const [item] = buildNavigationItems(routes);

    expect(item.title).toBe('_settings');
    expect(item.icon).toBe(Settings);
  });

  it('should ignore pageTitle and use navTitle as the item title', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'labels',
        name: 'settings-labels',
        component: Component,
        meta: { navTitle: 'Labels', pageTitle: 'All labels', isHidden: false },
      },
    ];

    const [item] = buildNavigationItems(routes, '/settings');

    expect(item.title).toBe('Labels');
  });
});
