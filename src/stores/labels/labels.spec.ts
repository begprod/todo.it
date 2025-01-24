import type { ILabel, IScope } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect, afterEach } from 'vitest';
import { useLabelsStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const labelsStore = useLabelsStore();
  const { scopes, labels, getAllScopes, getAllLabels } = storeToRefs(labelsStore);
  const { createScope, createLabel, deleteItem } = labelsStore;

  afterEach(() => {
    scopes.value = [];
    labels.value = [];
  });

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

  it('should get all scopes', () => {
    expect(getAllScopes.value.length).toBe(0);

    createScope({
      id: '1',
      name: 'test',
      color: '#000000',
    });

    expect(getAllScopes.value.length).toBe(1);
  });

  it('should get all labels', () => {
    expect(getAllLabels.value.length).toBe(0);

    createLabel({
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: null,
    });

    expect(getAllLabels.value.length).toBe(1);
  });

  it('should delete label', () => {
    createLabel({
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: null,
    });

    deleteItem('1');

    expect(getAllLabels.value.length).toBe(0);
  });
});
