import { describe, expect, it } from 'vitest';
import type { ILabel, IScope } from '@/types';
import {
  canonicalStringify,
  makeBackupPayload,
  parseEntityArray,
  parseTaskData,
  plainClone,
  taskRowsToMap,
} from '@/persistence/serialize/serialize';

describe('persistence serialization', () => {
  it('should clone nested plain objects without sharing references', () => {
    const source = { nested: { values: [1, 2] } };

    const clone = plainClone(source);
    clone.nested.values.push(3);

    expect(clone).toEqual({ nested: { values: [1, 2, 3] } });
    expect(source).toEqual({ nested: { values: [1, 2] } });
  });

  it('should stringify objects independently of key order', () => {
    expect(canonicalStringify({ b: { y: 2, x: 1 }, a: 0 })).toBe(
      canonicalStringify({ a: 0, b: { x: 1, y: 2 } }),
    );
  });

  it('should map task rows by day id', () => {
    expect(taskRowsToMap([{ dayId: 'backlog', items: [] }])).toEqual({
      backlog: { items: [] },
    });
  });

  it('should reject malformed task and entity data', () => {
    expect(() => parseTaskData([])).toThrow('Tasks data must be an object');
    expect(() => parseTaskData({ '01012026': {} })).toThrow('Invalid tasks data for 01012026');
    expect(() => parseEntityArray([], 'Labels')).not.toThrow();
    expect(() => parseEntityArray([{ name: 'Missing id' }], 'Labels')).toThrow(
      'Labels data must be an array of objects with ids',
    );
  });

  it('should create a backup payload with legacy keys and cloned values', () => {
    const scopes: Array<IScope> = [{ id: 'scope-1', name: 'Scope', color: '#000' }];
    const labels: Array<ILabel> = [
      { id: 'label-1', name: 'Label', color: '#fff', scopeTitle: 'Scope' },
    ];
    const tasks = { backlog: { items: [] } };

    const payload = makeBackupPayload(scopes, labels, tasks);

    expect(payload).toEqual({
      'todo:scopes': scopes,
      'todo:labels': labels,
      'todo.it:tasks': tasks,
    });
    expect(payload['todo:scopes']).not.toBe(scopes);
    expect(payload['todo.it:tasks']).not.toBe(tasks);
  });
});
