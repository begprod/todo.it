import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ICommonState } from '@/types';

export const useCommonStore = defineStore('common', {
  state: (): ICommonState => ({
    currentViewType: useLocalStorage('todo.it:currentViewType', 'rows'),
    lastCalendarUpdateDate: useLocalStorage('todo.it:lastUpdateDate', ''),
    isToastVisible: false,
    status: 'default',
    message: '',
    currentToastTimerId: 0,
  }),

  actions: {
    setLastUpdateDate(date: string) {
      this.lastCalendarUpdateDate = date;
    },
    setViewType(viewType: 'rows' | 'columns') {
      this.currentViewType = viewType;
    },
    setStatus(status: ICommonState['status']) {
      this.status = status;
    },
    setMessage(message: string) {
      this.message = message;
    },
    showToast() {
      let timeLeft: number;

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
