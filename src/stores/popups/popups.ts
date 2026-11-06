import { defineStore } from 'pinia';
import type { IPopupsState, ITask, ILabel } from '@/types';

export const usePopupsStore = defineStore('popups', {
  state: (): IPopupsState => ({
    currentEditingTask: null,
    currentEditingLabel: null,
    isTaskActionMenuOpen: false,
    isTaskLabelMenuOpen: false,
    isLabelActionMenuOpen: false,
  }),

  actions: {
    setCurrentEditingTask(task: ITask | null) {
      if (!task) {
        this.currentEditingTask = null;

        return;
      }

      this.currentEditingTask = task;
    },
    setCurrentEditingLabel(label: ILabel | null) {
      if (!label) {
        this.currentEditingLabel = null;

        return;
      }

      this.currentEditingLabel = label;
    },
    openTaskActionMenu() {
      this.isTaskActionMenuOpen = true;
    },
    closeTaskActionMenu() {
      this.isTaskActionMenuOpen = false;
      this.currentEditingTask = null;
    },
    openTaskLabelMenu() {
      this.isTaskLabelMenuOpen = true;
    },
    closeTaskLabelMenu() {
      this.isTaskLabelMenuOpen = false;
      this.currentEditingTask = null;
    },
    openLabelActionMenu() {
      this.isLabelActionMenuOpen = true;
    },
    closeLabelActionMenu() {
      this.isLabelActionMenuOpen = false;
      this.currentEditingLabel = null;
    },
  },
});
