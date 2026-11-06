import { defineStore } from 'pinia';
import type { IProject } from '@/types';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Array<IProject>,
  }),

  actions: {
    createProject(project: IProject) {
      this.projects.push(project);
    },
  },
});
