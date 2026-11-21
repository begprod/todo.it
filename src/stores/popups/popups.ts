import { defineStore } from 'pinia';
import type { IPopupsState, ITask, ILabel, IProject } from '@/types';

export const usePopupsStore = defineStore('popups', {
  state: (): IPopupsState => ({
    currentEditingTask: null,
    currentEditingLabel: null,
    currentEditingProject: null,
    isTaskActionMenuOpen: false,
    isTaskLabelMenuOpen: false,
    isLabelActionMenuOpen: false,
    isProjectFormOpen: false,
    isProjectEditFormOpen: false,
    isScopeFormOpen: false,
    isLabelFormOpen: false,
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
    setCurrentEditingProject(project: IProject | null) {
      if (!project) {
        this.currentEditingProject = null;

        return;
      }

      this.currentEditingProject = project;
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
    openProjectForm() {
      this.isProjectFormOpen = true;
    },
    closeProjectForm() {
      this.isProjectFormOpen = false;
    },
    openProjectEditForm() {
      this.isProjectEditFormOpen = true;
    },
    closeProjectEditForm() {
      this.isProjectEditFormOpen = false;
      this.currentEditingProject = null;
    },
    openScopeForm() {
      this.isScopeFormOpen = true;
    },
    closeScopeForm() {
      this.isScopeFormOpen = false;
    },
    openLabelForm() {
      this.isLabelFormOpen = true;
    },
    closeLabelForm() {
      this.isLabelFormOpen = false;
    },
  },
});
