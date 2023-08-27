import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonStore } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonStore => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
    isContextMenuOpen: false,
  }),

  getters: {
    getIsSidebarOpen(): boolean {
      return this.isSidebarOpen;
    },
    getIsContextMenuOpen(): boolean {
      return this.isContextMenuOpen;
    },
  },

  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleContextMenu() {
      this.isContextMenuOpen = !this.isContextMenuOpen;
    },
  },
});
