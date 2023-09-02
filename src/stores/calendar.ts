// @ts-ignore
import uniqid from 'uniqid';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getMonthWeekDays } from '@/helpers';
import type { ICalendarState, IMonth, ITask } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarState => ({
    currentDate: new Date(),
    months: [],
    tasks: useLocalStorage('todo.it:tasks', {}),
    currentEditingTask: null,
  }),

  getters: {
    getIsCurrentWeekIsLast(): boolean {
      return this.months[0].weeks[0].isLast && this.months[0].weeks[0].isCurrent;
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
      const numberOfMonths = 2;

      for (let i = 0; i <= numberOfMonths; i++) {
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
          if (this.tasks[dayItem.id]) {
            return;
          }

          this.tasks[dayItem.id] = {
            items: [],
          };
        });
      });

      if (!this.tasks.backlog) {
        this.tasks.backlog = {
          items: [],
        };
      }
    },
    checkAndCleanupTasksByDayStructure() {
      const monthsIds = this.months.map((month) => month.id);

      for (const day in this.tasks) {
        const cutDayFromId = day.substring(2);

        if (!monthsIds.includes(cutDayFromId) && day !== 'backlog') {
          delete this.tasks[day];
        }
      }
    },
    findTask(taskId: ITask['id'], dayId: ITask['dayId']): ITask | undefined {
      return this.tasks[dayId].items.find((task: ITask) => task.id === taskId);
    },
    findTaskIndex(taskId: ITask['id'], dayId: ITask['dayId']): number {
      return this.tasks[dayId].items.findIndex((task: ITask) => task.id === taskId);
    },
    createTask(dayId: ITask['dayId']) {
      const task: ITask = {
        id: uniqid(),
        title: '',
        description: '',
        dayId: dayId,
        isDone: false,
      };

      if (task.dayId === 'backlog') {
        this.tasks[task.dayId].items.unshift(task);

        return;
      }

      this.tasks[task.dayId].items.push(task);
    },
    updateTask(
      taskId: ITask['id'],
      dayId: ITask['dayId'],
      property: keyof ITask,
      value: string | boolean,
    ) {
      const task = this.findTask(taskId, dayId);

      if (!task) {
        return;
      }

      if (typeof task[property] === 'boolean' && typeof value === 'boolean') {
        task[property] = !task[property] as never;

        return;
      }

      task[property] = value as never;
    },
    moveToBacklog(taskId: ITask['id'], dayId: ITask['dayId']) {
      const task = this.findTask(taskId, dayId);

      if (!task) {
        return;
      }

      task.dayId = 'backlog';

      this.tasks['backlog'].items.unshift(task);

      this.deleteTask(taskId, dayId);
    },
    copyTask(currentEditingTask: ICalendarState['currentEditingTask']) {
      if (!currentEditingTask) {
        return;
      }

      const originalTask = this.findTask(currentEditingTask.id, currentEditingTask.dayId);
      const originalTaskIndex = this.findTaskIndex(currentEditingTask.id, currentEditingTask.dayId);
      const copiedTask = Object.assign({}, originalTask);

      copiedTask.id = uniqid();
      copiedTask.isDone = false;

      if (originalTask !== undefined) {
        this.tasks[originalTask.dayId].items.splice(originalTaskIndex + 1, 0, copiedTask);
      }
    },
    deleteTask(id: ITask['id'], dayId: ITask['dayId']) {
      const taskIndex = this.findTaskIndex(id, dayId);

      this.tasks[dayId].items.splice(taskIndex, 1);
    },
    setCurrentEditingTask(task: ITask | null) {
      if (!task) {
        this.currentEditingTask = null;

        return;
      }

      this.currentEditingTask = task;
    },
  },
});
