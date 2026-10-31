import { watch } from 'vue';
import type { WatchStopHandle } from 'vue';
import type { Pinia } from 'pinia';
import { useTasksStore, useLabelsStore, useCommonStore } from '@/stores';
import type { ILabel, IScope, ITask } from '@/types';
import { db } from '@/persistence/db/db';
import type { TodoDatabase } from '@/persistence/db/db';
import { canonicalStringify, plainClone, taskRowsToMap } from '@/persistence/serialize/serialize';
import type { ITaskRow } from '@/persistence/types';
import { readLegacyFallback } from '@/persistence/migration/migration';
import type { LegacyKey } from '@/persistence/migration/migration';

interface IPersistedState {
  tasks: Record<string, { items: Array<ITask> }>;
  scopes: Array<IScope>;
  labels: Array<ILabel>;
}

let stopWatch: WatchStopHandle | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let pendingSave: Promise<void> | undefined;
let activeDatabase: TodoDatabase = db;
let legacyMode = false;
let invalidLegacyKeys = new Set<LegacyKey>();
let savedState: IPersistedState = { tasks: {}, scopes: [], labels: [] };
let visibilityHandler: (() => void) | undefined;
let saveBlocked = false;
const notifyError = (message: string) => {
  const store = useCommonStore();
  store.setMessage(message);
  store.setStatus('error');
  store.showToast();
};

function currentState(): IPersistedState {
  const tasks = useTasksStore();
  const labels = useLabelsStore();
  return { tasks: tasks.tasks, scopes: labels.scopes, labels: labels.labels };
}

function snapshotState(): IPersistedState {
  return plainClone(currentState());
}

function changedEntries<T extends { id: string }>(current: Array<T>, previous: Array<T>) {
  const previousById = new Map(previous.map((entry) => [entry.id, canonicalStringify(entry)]));
  const currentById = new Map(current.map((entry) => [entry.id, canonicalStringify(entry)]));
  return {
    changed: current.filter((entry) => previousById.get(entry.id) !== currentById.get(entry.id)),
    removed: [...previousById.keys()].filter((id) => !currentById.has(id)),
  };
}

function stateDiff(current: IPersistedState, previous: IPersistedState) {
  const oldTasks = new Map(
    Object.entries(previous.tasks).map(([dayId, row]) => [dayId, canonicalStringify(row)]),
  );
  const currentTasks = new Map(
    Object.entries(current.tasks).map(([dayId, row]) => [dayId, canonicalStringify(row)]),
  );
  const taskRows: Array<ITaskRow> = Object.entries(current.tasks)
    .filter(([dayId, row]) => oldTasks.get(dayId) !== canonicalStringify(row))
    .map(([dayId, row]) => ({ dayId, items: plainClone(row.items) }));
  const removedDays = [...oldTasks.keys()].filter((dayId) => !currentTasks.has(dayId));
  const scopes = changedEntries(current.scopes, previous.scopes);
  const labels = changedEntries(current.labels, previous.labels);
  return { taskRows, removedDays, scopes, labels };
}

function writeLegacyState(current: IPersistedState): void {
  const values: Record<LegacyKey, unknown> = {
    'todo.it:tasks': current.tasks,
    'todo:scopes': current.scopes,
    'todo:labels': current.labels,
  };

  for (const key of Object.keys(values) as Array<LegacyKey>) {
    if (!invalidLegacyKeys.has(key)) {
      localStorage.setItem(key, JSON.stringify(values[key]));
    }
  }
}

async function saveDiff(): Promise<void> {
  if (saveBlocked) {
    return;
  }

  const current = snapshotState();
  const diff = stateDiff(current, savedState);

  if (
    !diff.taskRows.length &&
    !diff.removedDays.length &&
    !diff.scopes.changed.length &&
    !diff.scopes.removed.length &&
    !diff.labels.changed.length &&
    !diff.labels.removed.length
  ) {
    return;
  }

  if (legacyMode) {
    writeLegacyState(current);
    savedState = current;
    return;
  }

  await activeDatabase.transaction(
    'rw',
    activeDatabase.tasks,
    activeDatabase.scopes,
    activeDatabase.labels,
    async () => {
      if (diff.taskRows.length) {
        await activeDatabase.tasks.bulkPut(plainClone(diff.taskRows));
      }

      for (const dayId of diff.removedDays) {
        await activeDatabase.tasks.delete(dayId);
      }

      if (diff.scopes.changed.length) {
        await activeDatabase.scopes.bulkPut(plainClone(diff.scopes.changed));
      }

      for (const id of diff.scopes.removed) {
        await activeDatabase.scopes.delete(id);
      }

      if (diff.labels.changed.length) {
        await activeDatabase.labels.bulkPut(plainClone(diff.labels.changed));
      }

      for (const id of diff.labels.removed) {
        await activeDatabase.labels.delete(id);
      }
    },
  );
  savedState = current;
}

async function saveWithHandling(): Promise<void> {
  if (saveBlocked) {
    return;
  }

  if (pendingSave) {
    await pendingSave;
    return saveWithHandling();
  }

  pendingSave = saveDiff()
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown storage error';
      saveBlocked = true;
      stopPersistence();
      notifyError(`Unable to save data: ${message}. Please export your data.`);
    })
    .finally(() => {
      pendingSave = undefined;
    });
  await pendingSave;
}

export function scheduleSave(): void {
  if (saveBlocked) {
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = undefined;
    void saveWithHandling();
  }, 300);
}

export async function flush(): Promise<void> {
  if (saveBlocked) {
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = undefined;
  }

  await saveWithHandling();
}

export function startPersistence(
  pinia: Pinia,
  database: TodoDatabase,
  isLegacy: boolean,
  invalidKeys?: Set<LegacyKey>,
) {
  stopPersistence();
  saveBlocked = false;
  activeDatabase = database;
  legacyMode = isLegacy;
  invalidLegacyKeys = invalidKeys ?? invalidLegacyKeys;
  savedState = snapshotState();
  stopWatch = watch(
    () => {
      const taskStore = useTasksStore(pinia);
      const labelStore = useLabelsStore(pinia);
      return [taskStore.tasks, labelStore.scopes, labelStore.labels];
    },
    scheduleSave,
    { deep: true },
  );
  window.addEventListener('pagehide', flush);
  visibilityHandler = () => {
    if (document.visibilityState === 'hidden') {
      void flush();
    }
  };
  document.addEventListener('visibilitychange', visibilityHandler);
}

export function getInvalidLegacyKeys(): Set<LegacyKey> {
  return new Set(invalidLegacyKeys);
}

export function stopPersistence(): void {
  stopWatch?.();
  stopWatch = undefined;
  window.removeEventListener('pagehide', flush);

  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
  }

  visibilityHandler = undefined;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = undefined;
}

export async function waitForPendingSave(): Promise<void> {
  await pendingSave;
}

export function hydrateStores(pinia: Pinia, state: IPersistedState): void {
  useTasksStore(pinia).tasks = plainClone(state.tasks);
  const labels = useLabelsStore(pinia);
  labels.scopes = plainClone(state.scopes);
  labels.labels = plainClone(state.labels);
}

export async function hydrateFromDatabase(
  pinia: Pinia,
  database: TodoDatabase = db,
): Promise<void> {
  const [taskRows, scopes, labels] = await Promise.all([
    database.tasks.toArray(),
    database.scopes.toArray(),
    database.labels.toArray(),
  ]);
  hydrateStores(pinia, { tasks: taskRowsToMap(taskRows), scopes, labels });
}

export function hydrateLegacy(pinia: Pinia, invalidKeys = new Set<LegacyKey>()): void {
  hydrateStores(pinia, readLegacyFallback(invalidKeys));
}
