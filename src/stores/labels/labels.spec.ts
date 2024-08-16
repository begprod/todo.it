import type { IScope, ILabel } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useLabelsStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const labelsStore = useLabelsStore();
  const { scopes, labels } = storeToRefs(labelsStore);
  const { createScope, createLabel } = labelsStore;

  it('should create new scope', () => {
    const scope: IScope = {
      id: '1',
      name: 'test',
      color: '#000000',
    };

    createScope(scope);

    expect(scopes.value.length).toBe(1);
    expect(scopes.value[0]).toEqual(scope);
    expect(labels.value.length).toBe(0);
  });

  it('should create new label', () => {
    const label: ILabel = {
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: null,
    };

    createLabel(label);

    expect(labels.value.length).toBe(1);
    expect(labels.value[0]).toEqual(label);
  });
});
