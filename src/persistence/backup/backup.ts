import { getActivePinia } from 'pinia';
import { useCommonStore, useLabelsStore, useTasksStore } from '@/stores';
import { db } from '@/persistence/db/db';
import type { TodoDatabase } from '@/persistence/db/db';
import {
  makeBackupPayload,
  parseEntityArray,
  parseTaskData,
  plainClone,
} from '@/persistence/serialize/serialize';
import type { IBackupPayload, ITaskRow } from '@/persistence/types';
import type { ILabel, IScope, ITask } from '@/types';
import { persistenceStatus } from '@/persistence';
import {
  getInvalidLegacyKeys,
  startPersistence,
  stopPersistence,
  waitForPendingSave,
} from '@/persistence/sync/sync';

export function exportData(): void {
  if (persistenceStatus.mode === 'error') {
    const commonStore = useCommonStore();
    commonStore.setMessage('Unable to export data while persistence is unavailable.');
    commonStore.setStatus('error');
    commonStore.showToast();

    return;
  }

  const payload = makeBackupPayload(
    useLabelsStore().scopes,
    useLabelsStore().labels,
    useTasksStore().tasks,
  );
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `todo.it.backup.${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importData(database: TodoDatabase = db): Promise<void> {
  const data = await new Promise<IBackupPayload>((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.onchange = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;

      if (!files?.length) {
        reject(new Error('No files selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result;

          if (typeof result !== 'string') {
            throw new Error('Invalid file content');
          }

          const parsed: unknown = JSON.parse(result);

          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('JSON must be an object');
          }

          resolve(parsed as IBackupPayload);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to parse JSON'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(files[0]);
    };
    fileInput.click();
  });

  await applyImportedData(data, database, persistenceStatus.mode === 'legacy');
}

export async function applyImportedData(
  data: IBackupPayload,
  database: TodoDatabase = db,
  legacyMode = false,
): Promise<void> {
  if (persistenceStatus.mode === 'error') {
    throw new Error('Import is unavailable while storage is unavailable');
  }

  let tasks: Record<string, { items: Array<ITask> }> | undefined;
  let scopes: Array<IScope> | undefined;
  let labels: Array<ILabel> | undefined;

  if ('todo.it:tasks' in data) {
    tasks = parseTaskData(data['todo.it:tasks']);
  }

  if ('todo:scopes' in data) {
    scopes = parseEntityArray<IScope>(data['todo:scopes'], 'Scopes');
  }

  if ('todo:labels' in data) {
    labels = parseEntityArray<ILabel>(data['todo:labels'], 'Labels');
  }

  const pinia = getActivePinia();

  if (!pinia) {
    throw new Error('Pinia is not active');
  }

  const mode = persistenceStatus.mode;
  stopPersistence();

  try {
    await waitForPendingSave();

    if (legacyMode) {
      const previousValues = {
        'todo.it:tasks': localStorage.getItem('todo.it:tasks'),
        'todo:scopes': localStorage.getItem('todo:scopes'),
        'todo:labels': localStorage.getItem('todo:labels'),
      };

      try {
        if (tasks) {
          localStorage.setItem('todo.it:tasks', JSON.stringify(tasks));
        }

        if (scopes) {
          localStorage.setItem('todo:scopes', JSON.stringify(scopes));
        }

        if (labels) {
          localStorage.setItem('todo:labels', JSON.stringify(labels));
        }
      } catch (error) {
        for (const [key, value] of Object.entries(previousValues)) {
          try {
            if (value === null) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(key, value);
            }
          } catch {
            // Keep the original write error when storage also rejects rollback.
          }
        }

        throw error;
      }

      return;
    }

    await database.transaction('rw', database.tasks, database.scopes, database.labels, async () => {
      if (tasks) {
        await database.tasks.clear();
        const rows: Array<ITaskRow> = Object.entries(tasks).map(([dayId, value]) => ({
          dayId,
          items: plainClone(value.items),
        }));

        if (rows.length) {
          await database.tasks.bulkPut(rows);
        }
      }

      if (scopes) {
        await database.scopes.clear();

        if (scopes.length) {
          await database.scopes.bulkPut(plainClone(scopes));
        }
      }

      if (labels) {
        await database.labels.clear();

        if (labels.length) {
          await database.labels.bulkPut(plainClone(labels));
        }
      }
    });
  } catch (error) {
    if (mode === 'indexeddb' || mode === 'legacy') {
      startPersistence(pinia, database, legacyMode, getInvalidLegacyKeys());
    }

    throw error;
  }
}
