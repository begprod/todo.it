import { v4 as uuidv4 } from 'uuid';
import { defineStore, storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores';
import type { ITasksState, IMonth, ITask, IDay, ILabel, IProject } from '@/types';

export const useTasksStore = defineStore('tasks', {
  state: (): ITasksState => ({
    tasks: {},
  }),

  getters: {
    isProjectInUse: (state) => (projectId: IProject['id']) =>
      Object.values(state.tasks).some(({ items }) =>
        items.some((task) => task.projectId === projectId),
      ),
  },

  actions: {
    initTasksObject() {
      this.createTasksByDayObject();

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
      const now = new Date().toISOString();
      const task: ITask = {
        id: uuidv4(),
        description: '',
        dayId: dayId,
        isDone: false,
        labels: [],
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
      };

      const { items } = this.tasks[dayId];

      items.unshift(task);
    },
    addLabelToTask(task: ITask, label: ILabel) {
      if (!task.labels) {
        task.labels = [];
      }

      task.labels.push(label);
    },
    removeLabelFromTask(task: ITask, label: ILabel) {
      if (!task.labels) {
        return;
      }

      const index = task.labels.findIndex((item: ILabel) => item.id === label.id);

      if (index === -1) {
        throw new Error('Label not found');
      }

      task.labels.splice(index, 1);
    },
    setTaskProject(taskId: ITask['id'], dayId: ITask['dayId'], projectId?: IProject['id']) {
      const task = this.tasks[dayId]?.items.find((item) => item.id === taskId);

      if (!task) {
        return;
      }

      task.projectId = projectId;
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
        (task[property] as boolean) = !task[property];

        const { items } = this.tasks[dayId];
        const index = items.findIndex((item: ITask) => item.id === taskId);

        if (task.isDone && index !== items.length - 1) {
          items.splice(index, 1);
          items.push(task);
        } else if (!task.isDone && index !== 0) {
          items.splice(index, 1);
          items.unshift(task);
        }

        return;
      }

      (task[property] as string | boolean) = value;
    },
    moveTask(taskId: ITask['id'], fromDayId: ITask['dayId'], toDayId: ITask['dayId']) {
      if (fromDayId === toDayId) {
        return;
      }

      const { items } = this.tasks[fromDayId];
      const taskIndex = items.findIndex((task: ITask) => task.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = items[taskIndex];

      task.dayId = toDayId;

      if (!this.tasks[toDayId]) {
        // Direct backlog visits may not have initialized the calendar days.
        this.tasks[toDayId] = { items: [] };
      }

      this.tasks[toDayId].items.unshift(task);

      items.splice(taskIndex, 1);
    },
    moveToBacklog(taskId: ITask['id'], dayId: ITask['dayId']) {
      this.moveTask(taskId, dayId, 'backlog');
    },
    moveToDay(taskId: ITask['id'], dayId: ITask['dayId']) {
      this.moveTask(taskId, 'backlog', dayId);
    },
    duplicateTask(currentEditingTask: ITask | null) {
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
      const deepCopy = JSON.parse(JSON.stringify(originalTask));
      const now = new Date().toISOString();
      const newTask: ITask = {
        ...deepCopy,
        id: uuidv4(),
        isDone: false,
        createdAt: now,
        updatedAt: now,
      };

      delete newTask.startedAt;
      delete newTask.completedAt;

      items.splice(originalTaskIndex + 1, 0, newTask);
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
