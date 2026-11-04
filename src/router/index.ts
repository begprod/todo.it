import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import {
  Columns3,
  DatabaseBackup,
  LayoutDashboard,
  ListChecks,
  Settings,
  Tag,
  Tags,
  FolderKanban,
} from 'lucide-vue-next';
import HomeView from '@/views/HomeView.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import BacklogView from '@/views/BacklogView.vue';
import SettingsView from '@/views/SettingsView.vue';
import BaseSettingsScopes from '@/components/BaseSettings/partials/BaseSettingsScopes/BaseSettingsScopes.vue';
import BaseSettingsLabels from '@/components/BaseSettings/partials/BaseSettingsLabels/BaseSettingsLabels.vue';
import BaseSettingsViewType from '@/components/BaseSettings/partials/BaseSettingsViewType/BaseSettingsViewType.vue';
import BaseSettingsBackup from '@/components/BaseSettings/partials/BaseSettingsBackup/BaseSettingsBackup.vue';

declare module 'vue-router' {
  interface RouteMeta {
    navTitle: string;
    pageTitle?: string;
    isHidden: boolean;
    icon?: Component;
  }
}

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: { name: 'settings-scopes' },
  },
  {
    path: 'scopes',
    name: 'settings-scopes',
    component: BaseSettingsScopes,
    meta: { navTitle: '_scopes', pageTitle: 'Scopes', isHidden: false, icon: Tags },
  },
  {
    path: 'labels',
    name: 'settings-labels',
    component: BaseSettingsLabels,
    meta: { navTitle: '_labels', pageTitle: 'Labels', isHidden: false, icon: Tag },
  },
  {
    path: 'view-type',
    name: 'settings-view-type',
    component: BaseSettingsViewType,
    meta: { navTitle: '_board_layout', pageTitle: 'View type', isHidden: false, icon: Columns3 },
  },
  {
    path: 'backup',
    name: 'settings-backup',
    component: BaseSettingsBackup,
    meta: {
      navTitle: '_backup',
      pageTitle: 'Move your data',
      isHidden: false,
      icon: DatabaseBackup,
    },
  },
];

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { navTitle: '_board', isHidden: false, icon: LayoutDashboard },
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
    meta: { navTitle: '_projects', isHidden: false, icon: FolderKanban },
  },
  {
    path: '/backlog',
    name: 'backlog',
    component: BacklogView,
    meta: { navTitle: '_backlog', isHidden: false, icon: ListChecks },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { navTitle: '_settings', isHidden: false, icon: Settings },
    children: settingsRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: { navTitle: '', isHidden: true },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
