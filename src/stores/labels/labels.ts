import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ILabelState, ILabel, IScope } from '@/types';

export const useLabelsStore = defineStore('labels', {
  state: (): ILabelState => ({
    scopes: useLocalStorage<IScope[]>('todo:scopes', []),
    labels: useLocalStorage<ILabel[]>('todo:labels', []),
  }),

  getters: {
    getAllScopes: (state) => state.scopes,
    getAllLabels: (state) => state.labels,
  },

  actions: {
    createScope(scope: IScope) {
      this.scopes.push(scope);
    },
    createLabel(label: ILabel) {
      this.labels.push(label);
    },
    deleteScope(id: IScope['id']) {
      this.scopes = this.scopes.filter((scope: IScope) => scope.id !== id);
    },
    deleteLabel(id: ILabel['id']) {
      this.labels = this.labels.filter((label: ILabel) => label.id !== id);
    },
  },
});
