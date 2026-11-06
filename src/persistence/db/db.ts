import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { ILabel, IProject, IScope } from '@/types';
import type { IMigrationMeta, IPreMigrationBackup, ITaskRow } from '@/persistence/types';

export class TodoDatabase extends Dexie {
  tasks!: Table<ITaskRow, string>;
  scopes!: Table<IScope, string>;
  labels!: Table<ILabel, string>;
  projects!: Table<IProject, string>;
  meta!: Table<IMigrationMeta | IPreMigrationBackup, string>;

  constructor(name = 'todo.it') {
    super(name);
    this.version(1).stores({
      tasks: 'dayId',
      scopes: 'id',
      labels: 'id',
      meta: 'key',
    });
    this.version(2).stores({ projects: 'id' });
    this.on('versionchange', () => this.close());
  }
}

export const db = new TodoDatabase();

export async function openDb(database: TodoDatabase = db, timeoutMs = 5000): Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let blockedHandler: (() => void) | undefined;

  try {
    await Promise.race([
      database.open(),
      new Promise<never>((_, reject) => {
        blockedHandler = () => reject(new Error('IndexedDB opening was blocked'));
        database.on('blocked', blockedHandler);
      }),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('IndexedDB open timed out')), timeoutMs);
      }),
    ]);
  } catch (error) {
    database.close();
    throw error instanceof Error ? error : new Error('Unable to open IndexedDB');
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (blockedHandler) {
      database.on('blocked').unsubscribe(blockedHandler);
    }
  }
}

export async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    // Persistence is best-effort and unsupported in some browsers.
  }
}
