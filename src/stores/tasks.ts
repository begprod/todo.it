// @ts-ignore
import uniqid from 'uniqid';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { generateMonths } from '@/helpers';
import type { ICalendarState, IMonth, ITask } from '@/types';

export const useTasksStore = defineStore('tasks', {
  state: (): ICalendarState => ({
    months: [],
    tasks: useLocalStorage('todo.it:tasks', {}),
    currentEditingTask: null,
  }),

  actions: {
    initCalendarAndTasksObjects() {
      const monthsList = generateMonths(2);
      const isCurrentWeekIsLast = monthsList[0].weeks[0].isLast && monthsList[0].weeks[0].isCurrent;
      const nextMonth = isCurrentWeekIsLast ? generateMonths(0, 1) : [];

      this.months = [...nextMonth, ...monthsList];

      if (isCurrentWeekIsLast || !this.tasks.value || Object.keys(this.tasks.value).length === 0) {
        this.createTasksByDayObject();
      }

      this.checkAndCleanupTasksByDayObject();
    },
    createTasksByDayObject() {
      const days = this.months.flatMap((month: IMonth) => month.weeks.flatMap((week) => week.days));

      days.forEach((day) => {
        if (!this.tasks[day.id]) {
          this.tasks[day.id] = {
            items: [],
          };
        }
      });

      if (!this.tasks.backlog) {
        this.tasks.backlog = {
          items: [],
        };
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

      const { items } = this.tasks[dayId];

      task.dayId === 'backlog' ? items.unshift(task) : items.push(task);
    },
    updateTask(
      taskId: ITask['id'],
      dayId: ITask['dayId'],
      property: keyof ITask,
      value: string | boolean,
    ) {
      const task = this.tasks[dayId].items.find((task: ITask) => task.id === taskId);

      if (task) {
        if (typeof task[property] === 'boolean' && typeof value === 'boolean') {
          (task[property] as boolean) = !task[property];
        } else {
          (task[property] as string | boolean) = value;
        }
      }
    },
    moveToBacklog(taskId: ITask['id'], dayId: ITask['dayId']) {
      const { items } = this.tasks[dayId];
      const taskIndex = items.findIndex((task: ITask) => task.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = items[taskIndex];

      task.dayId = 'backlog';

      this.tasks['backlog'].items.unshift(task);

      items.splice(taskIndex, 1);
    },
    copyTask(currentEditingTask: ICalendarState['currentEditingTask']) {
      if (!currentEditingTask) {
        throw new Error('Current editing task is not defined');
      }

      const { id, dayId } = currentEditingTask;
      const { items } = this.tasks[dayId];
      const originalTaskIndex = items.findIndex((task: ITask) => task.id === id);

      if (originalTaskIndex === -1) {
        throw new Error('Task not found');
      }

      const originalTask = items[originalTaskIndex];
      const copiedTask = { ...originalTask, id: uniqid(), isDone: false };

      items.splice(originalTaskIndex + 1, 0, copiedTask);
    },
    deleteTask(id: ITask['id'], dayId: ITask['dayId']) {
      const { items } = this.tasks[dayId];

      this.tasks[dayId].items = items.filter((task: ITask) => task.id !== id);
    },
    setCurrentEditingTask(task: ITask | null) {
      if (!task) {
        this.currentEditingTask = null;

        return;
      }

      this.currentEditingTask = task;
    },
    checkAndCleanupTasksByDayObject() {
      const monthsIds = this.months.map((month) => month.id);

      for (const day in this.tasks) {
        if (!monthsIds.includes(day.substring(2)) && day !== 'backlog') {
          delete this.tasks[day];
        }
      }
    },
  },
});
