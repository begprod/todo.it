import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ILabelState, ILabel, IScope } from '@/types';

export const useLabelsStore = defineStore('labels', {
  state: (): ILabelState => ({
    scopes: useLocalStorage<Array<IScope>>('todo:scopes', []),
    labels: useLocalStorage<Array<ILabel>>('todo:labels', []),
  }),

  getters: {
    getSortedScopes: (state) => state.scopes.sort((a, b) => a.name.localeCompare(b.name)),
    getGroupedLabels: (state) => {
      const groupedMap = new Map<string, Array<ILabel>>();
      const result = [];

      for (const label of state.labels) {
        const letter = (label.scopeTitle || label.name)[0].toUpperCase();

        if (!groupedMap.has(letter)) {
          groupedMap.set(letter, []);
        }

        groupedMap.get(letter)!.push(label);
      }

      const sortedLetters = [...groupedMap.keys()].sort();

      for (const letter of sortedLetters) {
        const group = groupedMap.get(letter) ?? [];

        const withScope = group.filter((label) => label.scopeTitle);
        const withoutScope = group.filter((label) => !label.scopeTitle);

        withScope.sort((a, b) => {
          const scopeCompare = a.scopeTitle!.localeCompare(b.scopeTitle || '');

          return scopeCompare !== 0 ? scopeCompare : a.name.localeCompare(b.name);
        });

        withoutScope.sort((a, b) => a.name.localeCompare(b.name));

        result.push(...withScope, ...withoutScope);
      }

      return result;
    },
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
