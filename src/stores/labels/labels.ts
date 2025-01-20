import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ILabelState, ILabel } from '@/types';

export const useLabelsStore = defineStore('labels', {
  state: (): ILabelState => ({
    scopes: useLocalStorage<Array<ILabel>>('todo:scopes', []),
    labels: useLocalStorage<Array<ILabel>>('todo:labels', []),
  }),

  getters: {
    getAllScopes: (state): Array<ILabel> => state.scopes,
    getAllLabels: (state): Array<ILabel> => state.labels,
  },

  actions: {
    createScope(scope: ILabel) {
      this.scopes.push(scope);
    },
    createLabel(label: ILabel) {
      this.labels.push(label);
    },
    deleteItem(id: ILabel['id']) {
      this.scopes = this.scopes.filter((scope: ILabel) => scope.id !== id);
      this.labels = this.labels.filter((label: ILabel) => label.id !== id);
    },
  },
});
