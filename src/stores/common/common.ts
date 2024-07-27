import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState, ITask } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    currentEditingTask: null,
    lastCalendarUpdateDate: useLocalStorage('todo.it:lastUpdateDate', ''),
    isBacklogOpen: useLocalStorage('todo.it:isBacklogOpen', true),
    isSettingsOpen: true,
    isActionMenuOpen: false,
    isToastVisible: false,
    status: 'default',
    message: '',
    currentToastTimerId: 0,
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
    setStatus(status: ICommonState['status']) {
      this.status = status;
    },
    setMessage(message: string) {
      this.message = message;
    },
    showToast() {
      let timeLeft: number = 5;

      const updateTimer = () => {
        clearTimeout(this.currentToastTimerId);
        timeLeft = 5;

        this.currentToastTimerId = window.setInterval(() => {
          timeLeft -= 1;

          if (timeLeft <= 0) {
            clearTimeout(this.currentToastTimerId);
            this.closeToast();
          }
        }, 1000);
      };

      if (this.isToastVisible) {
        updateTimer();
      }

      this.isToastVisible = true;

      updateTimer();
    },
    closeToast() {
      clearTimeout(this.currentToastTimerId);

      this.isToastVisible = false;
      this.status = 'default';
      this.message = '';
    },
  },
});
