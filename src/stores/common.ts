import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
    isContextMenuOpen: false,
  }),

  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleContextMenu() {
      this.isContextMenuOpen = !this.isContextMenuOpen;
    },
  },
});
