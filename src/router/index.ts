import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import { LayoutDashboard, ListChecks, Settings } from 'lucide-vue-next';
import HomeView from '@/views/HomeView.vue';
import BacklogView from '@/views/BacklogView.vue';
import SettingsView from '@/views/SettingsView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    isHidden: boolean;
    icon?: Component;
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '_board', isHidden: false, icon: LayoutDashboard },
  },
  {
    path: '/backlog',
    name: 'backlog',
    component: BacklogView,
    meta: { title: '_backlog', isHidden: false, icon: ListChecks },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: '_settings', isHidden: false, icon: Settings },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: { title: '', isHidden: true },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
