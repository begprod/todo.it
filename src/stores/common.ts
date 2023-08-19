import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonStore } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonStore => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
  }),

  getters: {
    getIsSidebarOpen(): boolean {
      return this.isSidebarOpen;
    },
  },

  actions: {
    openSidebar() {
      this.isSidebarOpen = true;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
});
