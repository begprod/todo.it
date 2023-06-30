import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { type ICalendarStore } from '@/types';
import { getMonthWeekDays } from '@/helpers';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentMonth: {
      id: format(new Date, 'MMyyyy'),
      name: format(new Date(), 'MMMM'),
      year: format(new Date(), 'yyyy'),
      weeks: [],
    }
  }),

  getters: {},

  actions: {
    setCurrentMonth(): void {
      const currentDate = new Date();
      const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // @ts-ignore
      this.currentMonth.weeks = getMonthWeekDays(currentDate, startMonth, endMonth);
    }
  },
});
