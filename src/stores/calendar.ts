import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getMonthWeekDays } from '@/helpers';
import type { ICalendarStore, IMonth, ITask } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarStore => ({
    currentDate: new Date(),
    months: [],
    tasksByDay: useLocalStorage('todo.it:tasksByDay', {}),
    backlog: useLocalStorage('todo.it:backlog', []),
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
      return this.backlog;
    },
    getDayTasksByDayId: (state) => (dayId: string): Array<ITask> => {
      return state.tasksByDay[dayId].tasks;
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
    createTasksByDayStructure() {
      const days = this.months.map((month) => month.weeks.map((week) => week.days)).flat();

      days.forEach((day) => {
        day.forEach((dayItem) => {
            this.tasksByDay[dayItem.id] = {
              tasks: [],
            };
        });
      });
    },
    addTaskToDay(task: ITask) {
      if (task.dayId !== null) {
        this.tasksByDay[task.dayId].tasks.unshift(task);
      }
    },
    addTaskToBacklog(task: ITask) {
      this.backlog.unshift(task);
    },
    updateTask(task: ITask) {
      if (task.dayId !== null) {
        this.tasksByDay[task.dayId].tasks.find((taskItem: ITask) => {
          if (taskItem.id === task.id) {
            Object.assign(taskItem, task);
          }
        });

        return;
      }


      this.backlog.find((taskItem) => {
        if (taskItem.id === task.id) {
          Object.assign(taskItem, task);
        }
      });
    },
  },
});
