import type { ICommonState } from '@/types';
import uniqid from 'uniqid';
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
    duplicateItem(currentEditingItem: ICommonState['currentEditingLabel']) {
      if (!currentEditingItem) {
        throw new Error('Current editing item is not defined');
      }

      const typeOfItem = 'scopeTitle' in currentEditingItem ? 'label' : 'scope';

      const { name, color } = currentEditingItem;

      const newItem = {
        id: uniqid(),
        name,
        color,
        scopeTitle:
          typeOfItem === 'label' && 'scopeTitle' in currentEditingItem
            ? currentEditingItem.scopeTitle
            : null,
      };

      if (typeOfItem === 'scope') {
        this.scopes.push(newItem);
      } else {
        this.labels.push(newItem);
      }
    },
    deleteItem(id: ILabel['id'] | IScope['id']) {
      this.scopes = this.scopes.filter((scope: IScope) => scope.id !== id);
      this.labels = this.labels.filter((label: ILabel) => label.id !== id);
    },
  },
});
