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
    updateProject(project: IProject) {
      const index = this.projects.findIndex((currentProject) => currentProject.id === project.id);

      if (index === -1) {
        return;
      }

      this.projects.splice(index, 1, project);
    },
    deleteProject(id: IProject['id']) {
      this.projects = this.projects.filter((project) => project.id !== id);
    },
  },
});
