import type { ICalendarStore, IDay } from '@/types';
import { format } from 'date-fns';
import { defineStore } from 'pinia';
import { generateMonths, generateDays } from '@/helpers';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    months: [],
    days: [],
    shouldGenerateNextMonth: false,
  }),

  getters: {
    getDaysByMonthId:
      (state) =>
      (monthId: string): Array<IDay> => {
        return state.days.filter((day) => day.monthId === monthId);
      },
  },

  actions: {
    initCalendar() {
      const monthsList = generateMonths(2);
      const daysList = generateDays(monthsList);
      const triggerDayId = Number(daysList[daysList.length - 25].id);
      const currentDayId = Number(format(new Date(), 'ddMMyyyy'));

      this.shouldGenerateNextMonth = currentDayId > triggerDayId;

      const nextMonth = this.shouldGenerateNextMonth ? generateMonths(0, 1) : [];
      const nextMonthDays = this.shouldGenerateNextMonth ? generateDays(nextMonth) : [];

      this.months = [...nextMonth, ...monthsList];
      this.days = [...nextMonthDays, ...daysList];
    },
  },
});
