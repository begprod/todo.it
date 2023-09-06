import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
    lastCalendarUpdateDate: useLocalStorage('todo.it:lastUpdateDate', ''),
    isActionMenuOpen: false,
  }),

  actions: {
    setLastUpdateDate(date: string) {
      this.lastCalendarUpdateDate = date;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleTaskActionMenu() {
      this.isActionMenuOpen = !this.isActionMenuOpen;
    },
  },
});
