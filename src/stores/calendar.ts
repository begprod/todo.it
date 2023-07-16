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
    getTodoByDayId: (state) => (dayId: string): ITodo | undefined => {
      return state.allTodos.find((todo) => todo.dayId === dayId);
    },
    getIsCurrentWeekIsLast(): boolean {
      return this.months[0].weeks[0].isLast && this.months[0].weeks[0].isCurrent;
    }
  },

  actions: {
    setNextMonth() {
      const month = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      const monthNumber = month.getMonth();
      const monthDays = getMonthWeekDays(startOfMonth(month), endOfMonth(month), monthNumber);
      const isCurrent = monthNumber === this.currentDate.getMonth();

      const monthObj: IMonth = {
        id: format(month, 'MMyyyy'),
        name: format(month, 'MMMM'),
        year: format(month, 'yyyy'),
        weeks: monthDays,
        isCurrent,
      };

      this.months.unshift(monthObj);
    },
    setMonths() {
      for (let i = 0; i <= 2; i++) {
        const month = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - i, 1);
        const monthNumber = month.getMonth();
        const monthDays = getMonthWeekDays(startOfMonth(month), endOfMonth(month), monthNumber);
        const isCurrent = monthNumber === this.currentDate.getMonth();

        const monthObj: IMonth = {
          id: format(month, 'MMyyyy'),
          name: format(month, 'MMMM'),
          year: format(month, 'yyyy'),
          weeks: monthDays,
          isCurrent,
        };

        this.months.push(monthObj);
      }
    },
    addTodo(todo: ITodo) {
      this.allTodos.push(todo);
    }
  },
});
