// @ts-ignore
import uniqid from 'uniqid';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { generateMonths } from '@/helpers';
import type { ICalendarState, ITask } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: (): ICalendarState => ({
    months: [],
    tasks: useLocalStorage('todo.it:tasks', {}),
    currentEditingTask: null,
  }),

  actions: {
    createMonthList() {
      const monthsList = generateMonths(2);
      const isCurrentWeekIsLast = monthsList[0].weeks[0].isLast && monthsList[0].weeks[0].isCurrent;
      const nextMonth = isCurrentWeekIsLast ? generateMonths(0, 1) : [];

      this.months = [...nextMonth, ...monthsList];

      if (isCurrentWeekIsLast) {
        this.createTasksByDayStructure();
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
        const cutDayFromDayId = day.substring(2);

        if (!monthsIds.includes(cutDayFromDayId) && day !== 'backlog') {
          delete this.tasks[day];
        }
      }
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
      const task = this.tasks[dayId].items.find((task: ITask) => task.id === taskId);

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
      const task = this.tasks[dayId].items.find((task: ITask) => task.id === taskId);

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

      const originalTask = this.tasks[currentEditingTask.dayId].items.find(
        (task: ITask) => task.id === currentEditingTask.id,
      );
      const originalTaskIndex = this.tasks[currentEditingTask.dayId].items.findIndex(
        (task: ITask) => task.id === currentEditingTask.id,
      );
      const copiedTask = Object.assign({}, originalTask);

      copiedTask.id = uniqid();
      copiedTask.isDone = false;

      if (originalTask !== undefined) {
        this.tasks[originalTask.dayId].items.splice(originalTaskIndex + 1, 0, copiedTask);
      }
    },
    deleteTask(id: ITask['id'], dayId: ITask['dayId']) {
      const taskIndex = this.tasks[dayId].items.findIndex((task: ITask) => task.id === id);

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
