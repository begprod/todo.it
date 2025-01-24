import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ILabelState, ILabel, IScope } from '@/types';

export const useLabelsStore = defineStore('labels', {
  state: (): ILabelState => ({
    scopes: useLocalStorage<Array<IScope>>('todo:scopes', []),
    labels: useLocalStorage<Array<ILabel>>('todo:labels', []),
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
    deleteItem(id: IScope['id'] | ILabel['id']) {
      this.scopes = this.scopes.filter((scope) => scope.id !== id);
      this.labels = this.labels.filter((label) => label.id !== id);
    },
  },
});
