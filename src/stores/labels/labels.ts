import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ILabelState, ILabel, IScope } from '@/types';

export const useLabelsStore = defineStore('labels', {
  state: (): ILabelState => ({
    scopes: useLocalStorage<Array<IScope>>('todo:scopes', []),
    labels: useLocalStorage<Array<ILabel>>('todo:labels', []),
  }),

  getters: {
    getAllScopes: (state): Array<IScope> => state.scopes,
    getAllLabels: (state): Array<ILabel> => state.labels,
  },

  actions: {
    createScope(scope: IScope) {
      this.scopes.push(scope);
    },
    createLabel(label: ILabel) {
      this.labels.push(label);
    },
    deleteItem(id: ILabel['id'] | IScope['id']) {
      this.scopes = this.scopes.filter((scope: IScope) => scope.id !== id);
      this.labels = this.labels.filter((label: ILabel) => label.id !== id);
    },
  },
});
