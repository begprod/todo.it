import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { type ICalendarStore, type IMonth, } from '@/types';
import { getMonthWeekDays } from '@/helpers';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentDate: new Date(),
    currentMonth: {
      id: format(new Date, 'MMyyyy'),
      name: format(new Date(), 'MMMM'),
      year: format(new Date(), 'yyyy'),
      weeks: [],
    }
  }),

  getters: {
    getCurrentDate(): Date {
      return this.currentDate;
    },
    getCurrentDateMonth(): string {
      return format(this.currentDate, 'MMMM');
    },
    getCurrentMonth(): IMonth {
      return this.currentMonth;
    }
  },

  actions: {
    setCurrentMonth(): void {
      const startMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const endMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

      this.currentMonth.weeks = getMonthWeekDays(this.currentDate, startMonth, endMonth);
    }
  },
});
