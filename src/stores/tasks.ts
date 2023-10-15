import type { ICommonState, ITasksState, IMonth, ITask, IDay } from '@/types';
import uniqid from 'uniqid';
import { defineStore, storeToRefs } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useCalendarStore } from '@/stores';

export const useTasksStore = defineStore('tasks', {
  state: (): ITasksState => ({
    tasks: useLocalStorage('todo.it:tasks', {}),
  }),

  actions: {
    initTasksObject() {
      const { shouldGenerateNextMonth } = storeToRefs(useCalendarStore());

      if (shouldGenerateNextMonth || !this.tasks || Object.keys(this.tasks).length === 0) {
        this.createTasksByDayObject();
      }

      this.checkAndCleanupTasksByDayObject();
    },
    createTasksByDayObject() {
      const { days } = storeToRefs(useCalendarStore());

      days.value.forEach((day: IDay) => {
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

      task.dayId === 'backlog' ? items.unshift(task) : items.unshift(task);
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
    copyTask(currentEditingTask: ICommonState['currentEditingTask']) {
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
    checkAndCleanupTasksByDayObject() {
      const { months } = storeToRefs(useCalendarStore());
      const monthsIds = months.value.map((month: IMonth) => month.id);

      for (const day in this.tasks) {
        if (!monthsIds.includes(day.substring(2)) && day !== 'backlog') {
          delete this.tasks[day];
        }
      }
    },
  },
});
