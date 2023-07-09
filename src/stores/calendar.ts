import { defineStore } from 'pinia';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { getMonthWeekDays } from '@/helpers';
import type { ICalendarStore, IMonth, ITodo } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentDate: new Date(),
    allTodos: [],
    months: [],
  }),

  getters: {
    getCurrentDate(): Date {
      return this.currentDate;
    },
    getCurrentDateMonth(): string {
      return format(this.currentDate, 'MMMM');
    },
    getMonths(): Array<IMonth> {
      return this.months;
    },
    getCurrentMonth(): IMonth {
      return this.months[0];
    },
  },

  actions: {
    setMonths() {
      for (let i = 0; i <= 2; i++) {
        const month = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - i, 1);
        const monthNumber = month.getMonth();
        const monthDays = getMonthWeekDays(startOfMonth(month), endOfMonth(month), monthNumber);

        const monthObj: IMonth = {
          id: format(month, 'MMyyyy'),
          name: format(month, 'MMMM'),
          year: format(month, 'yyyy'),
          weeks: monthDays,
        };

        this.months.push(monthObj);
      }
    },
    addTodo(todo: ITodo) {
      this.allTodos.push(todo);
    }
  },
});
