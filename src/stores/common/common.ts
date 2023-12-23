import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState, ITask } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    isSidebarOpen: useLocalStorage('todo.it:isSidebarOpen', true),
    lastCalendarUpdateDate: useLocalStorage('todo.it:lastUpdateDate', ''),
    isActionMenuOpen: false,
    currentEditingTask: null,
  }),

  actions: {
    setLastUpdateDate(date: string) {
      this.lastCalendarUpdateDate = date;
    },
    setCurrentEditingTask(task: ITask | null) {
      if (!task) {
        this.currentEditingTask = null;

        return;
      }

      this.currentEditingTask = task;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    openTaskActionMenu() {
      this.isActionMenuOpen = true;
    },
    closeTaskActionMenu() {
      this.isActionMenuOpen = false;
    },
  },
});
