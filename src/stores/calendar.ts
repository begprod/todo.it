import { defineStore } from 'pinia';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { getMonthWeekDays } from '@/helpers';
import type { ICalendarStore, IMonth, ITodo } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentDate: new Date(),
    months: [],
    backlogTodos: [],
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
    getIsCurrentWeekIsLast(): boolean {
      return this.months[0].weeks[0].isLast && this.months[0].weeks[0].isCurrent;
    },
    getBacklogTodos(): Array<ITodo> {
      return this.backlogTodos;
    },
    getDayTodos: (state) => (dayId: string): Array<ITodo> => {
      const allWeeks = state.months.flatMap((month) => month.weeks);
      const day = allWeeks.flatMap((week) => week.days).find((day) => day.id === dayId);

      return day ? day.todos : [];
    },
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
      if (todo.dayId) {
        const day = this.months.flatMap((month) => month.weeks).flatMap((week) => week.days).find((day) => day.id === todo.dayId);

        if (day) {
          day.todos.push(todo);
        }

        return;
      }

      this.backlogTodos.push(todo);
    }
  },
});
