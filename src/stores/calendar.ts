import { defineStore } from 'pinia';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { getMonthWeekDays } from '@/helpers';
import type { ICalendarStore, IMonth, ITask } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentDate: new Date(),
    months: [],
    backlog: [],
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
    getBacklogTasks(): Array<ITask> {
      return this.backlog.reverse();
    },
    getDayTasksByDayId: (state) => (dayId: string): Array<ITask> => {
      const day = state.months.flatMap((month) => month.weeks).flatMap((week) => week.days).find((day) => day.id === dayId);

      if (day) {
        return day.tasks;
      }

      return [];
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
    addTask(task: ITask) {
      if (task.dayId) {
        const day = this.months.flatMap((month) => month.weeks).flatMap((week) => week.days).find((day) => day.id === task.dayId);

        if (day) {
          day.tasks.unshift(task);
        }

        return;
      }

      this.backlog.push(task);
    },
    updateTask(task: ITask) {
      if (task.dayId) {
        const day = this.months.flatMap((month) => month.weeks).flatMap((week) => week.days).find((day) => day.id === task.dayId);

        if (day) {
          const oldTask = day.tasks.find((t) => t.id === task.id);

          if (oldTask) {
            Object.assign(oldTask, task);
          }
        }

        return;
      }

      const oldBacklogTask = this.backlog.find((t) => t.id === task.id);

      if (oldBacklogTask) {
        Object.assign(oldBacklogTask, task);
      }
    },
  },
});
