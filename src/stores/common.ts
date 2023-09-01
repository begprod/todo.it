import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
    isActionMenuOpen: false,
  }),

  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleTaskActionMenu() {
      this.isActionMenuOpen = !this.isActionMenuOpen;
    },
  },
});
