import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState, ITask } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    currentEditingTask: null,
    lastCalendarUpdateDate: useLocalStorage('todo.it:lastUpdateDate', ''),
    isBacklogOpen: useLocalStorage('todo.it:isBacklogOpen', true),
    isSettingsOpen: false,
    isActionMenuOpen: false,
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
      this.isBacklogOpen = !this.isBacklogOpen;
    },
    toggleSettings() {
      this.isSettingsOpen = !this.isSettingsOpen;
    },
    openTaskActionMenu() {
      this.isActionMenuOpen = true;
    },
    closeTaskActionMenu() {
      this.isActionMenuOpen = false;
    },
  },
});
