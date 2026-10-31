import type { ILabel, IScope, ITask } from '@/types';
import type { IBackupPayload, ITaskRow } from '@/persistence/types';

export function plainClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalize(item)]),
    );
  }

  return value;
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(normalize(value));
}

export function canonicalEntityArray<T extends { id: string }>(value: Array<T>): string {
  return canonicalStringify([...value].sort((left, right) => left.id.localeCompare(right.id)));
}

export function taskRowsToMap(rows: Array<ITaskRow>): Record<string, { items: Array<ITask> }> {
  return Object.fromEntries(rows.map(({ dayId, items }) => [dayId, { items }]));
}

export function makeBackupPayload(
  scopes: Array<IScope>,
  labels: Array<ILabel>,
  tasks: Record<string, { items: Array<ITask> }>,
): IBackupPayload {
  return {
    'todo:scopes': plainClone(scopes),
    'todo:labels': plainClone(labels),
    'todo.it:tasks': plainClone(tasks),
  };
}

export function parseTaskData(value: unknown): Record<string, { items: Array<ITask> }> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Tasks data must be an object');
  }

  for (const [dayId, record] of Object.entries(value)) {
    if (
      !record ||
      typeof record !== 'object' ||
      !Array.isArray((record as { items?: unknown }).items)
    ) {
      throw new Error(`Invalid tasks data for ${dayId}`);
    }
  }

  return value as Record<string, { items: Array<ITask> }>;
}

export function parseEntityArray<T extends { id: string }>(value: unknown, name: string): Array<T> {
  if (
    !Array.isArray(value) ||
    value.some((item) => !item || typeof item !== 'object' || typeof item.id !== 'string')
  ) {
    throw new Error(`${name} data must be an array of objects with ids`);
  }

  return value as Array<T>;
}
