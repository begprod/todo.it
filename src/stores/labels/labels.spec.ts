import type { ILabel, IScope } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect, afterEach } from 'vitest';
import { useLabelsStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const labelsStore = useLabelsStore();
  const { scopes, labels, getSortedScopes, getGroupedLabels } = storeToRefs(labelsStore);
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

  it('should get sorted scopes', () => {
    expect(getSortedScopes.value.length).toBe(0);

    createScope({
      id: '1',
      name: 'test',
      color: '#000000',
    });

    createScope({
      id: '2',
      name: 'A test',
      color: '#000000',
    });

    expect(getSortedScopes.value.length).toBe(2);
    expect(getSortedScopes.value[0].id).toEqual('2');
    expect(getSortedScopes.value[1].id).toEqual('1');
  });

  it('should get grouped labels by scope', () => {
    expect(getGroupedLabels.value.length).toBe(0);

    createLabel({
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: null,
    });

    createLabel({
      id: '2',
      name: 'A test',
      color: '#000000',
      scopeTitle: null,
    });

    createLabel({
      id: '3',
      name: 'A test',
      color: '#000000',
      scopeTitle: 'A scope',
    });

    createLabel({
      id: '3',
      name: 'test',
      color: '#000000',
      scopeTitle: 'scope',
    });

    expect(getGroupedLabels.value.length).toBe(4);
    expect(getGroupedLabels.value[0].id).toEqual('3');
    expect(getGroupedLabels.value[0].scopeTitle).toEqual('A scope');
    expect(getGroupedLabels.value[1].id).toEqual('2');
    expect(getGroupedLabels.value[1].scopeTitle).toEqual(null);
    expect(getGroupedLabels.value[2].id).toEqual('3');
    expect(getGroupedLabels.value[2].scopeTitle).toEqual('scope');
    expect(getGroupedLabels.value[3].id).toEqual('1');
    expect(getGroupedLabels.value[3].scopeTitle).toEqual(null);
  });

  it('should delete label', () => {
    createLabel({
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: null,
    });

    deleteItem('1');

    expect(getGroupedLabels.value.length).toBe(0);
  });
});
