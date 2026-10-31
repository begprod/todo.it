import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCommonStore, useLabelsStore, useTasksStore } from '@/stores';
import { TodoDatabase } from '@/persistence/db/db';
import { backupFixture } from '@/persistence/migration/backup.fixture';
import { persistenceStatus } from '@/persistence';
import { applyImportedData, exportData } from '@/persistence/backup/backup';
import { stopPersistence } from '@/persistence/sync/sync';
import {
  canonicalEntityArray,
  canonicalStringify,
  makeBackupPayload,
  taskRowsToMap,
} from '@/persistence/serialize/serialize';
import type { IBackupPayload } from '@/persistence/types';

let database: TodoDatabase;
let databaseSequence = 0;

const createDatabase = async () => {
  database = new TodoDatabase(`todo.it-backup-test-${Date.now()}-${databaseSequence++}`);
  await database.open();
  return database;
};

afterEach(async () => {
  stopPersistence();
  vi.restoreAllMocks();
  localStorage.clear();
  persistenceStatus.mode = 'indexeddb';
  persistenceStatus.error = undefined;

  if (database) {
    database.close();
    await database.delete();
  }
});

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('backup import and export', () => {
  it('should round-trip task, searchString, and scopeTitle data deeply', async () => {
    const db = await createDatabase();
    const payload = makeBackupPayload(
      backupFixture['todo:scopes'] ?? [],
      backupFixture['todo:labels'] ?? [],
      backupFixture['todo.it:tasks'] ?? {},
    );

    await applyImportedData(payload, db);
    const tasks = taskRowsToMap(await db.tasks.toArray());
    expect(canonicalStringify(tasks)).toBe(
      canonicalStringify(backupFixture['todo.it:tasks'] ?? {}),
    );
    expect(canonicalEntityArray(await db.scopes.toArray())).toBe(
      canonicalEntityArray(backupFixture['todo:scopes'] ?? []),
    );
    expect(canonicalEntityArray(await db.labels.toArray())).toBe(
      canonicalEntityArray(backupFixture['todo:labels'] ?? []),
    );
  });

  it('should import only present known keys, ignore unknown keys, and preserve migration backup metadata', async () => {
    const db = await createDatabase();
    await db.tasks.put({ dayId: 'backlog', items: [] });
    await db.scopes.put({ id: 'keep', name: 'Keep', color: '#000' });
    const migrationMarker = {
      key: 'migration.localStorage' as const,
      status: 'done' as const,
      source: 'localStorage' as const,
      at: new Date().toISOString(),
      lsCleaned: true,
      counts: { days: 0, tasks: 0, scopes: 0, labels: 0 },
    };
    const preMigrationBackup = {
      key: 'backup.preMigration' as const,
      at: 'time',
      raw: { 'todo:scopes': '[]' },
    };
    await db.meta.bulkPut([migrationMarker, preMigrationBackup]);
    const partial: IBackupPayload = {
      'todo.it:tasks': { '01012026': { items: [] } },
      unrecognized: { data: true },
    };

    await applyImportedData(partial, db);
    expect((await db.tasks.toArray()).map(({ dayId }) => dayId)).toEqual(['01012026']);
    expect(await db.scopes.get('keep')).toEqual({ id: 'keep', name: 'Keep', color: '#000' });
    expect(await db.meta.get('migration.localStorage')).toMatchObject({ status: 'done' });
    expect(await db.meta.get('backup.preMigration')).toEqual(preMigrationBackup);
  });

  it('should apply recognized imports to localStorage in legacy fallback mode', async () => {
    const db = await createDatabase();
    await applyImportedData({ 'todo:labels': [] }, db, true);
    expect(localStorage.getItem('todo:labels')).toBe('[]');
    expect(localStorage.getItem('todo.it:tasks')).toBeNull();
    expect(await db.labels.count()).toBe(0);
  });

  it('should roll back legacy localStorage writes when a later key fails', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', 'previous tasks');
    localStorage.setItem('todo:scopes', 'previous scopes');
    localStorage.setItem('todo:labels', 'previous labels');
    persistenceStatus.mode = 'legacy';
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementation((key, value) => {
      if (key === 'todo:scopes' && value === '[]') {
        throw new Error('storage write failed');
      }

      return originalSetItem.call(localStorage, key, value);
    });

    await expect(
      applyImportedData({ 'todo.it:tasks': {}, 'todo:scopes': [], 'todo:labels': [] }, db, true),
    ).rejects.toThrow('storage write failed');

    expect(localStorage.getItem('todo.it:tasks')).toBe('previous tasks');
    expect(localStorage.getItem('todo:scopes')).toBe('previous scopes');
    expect(localStorage.getItem('todo:labels')).toBe('previous labels');
  });

  it('should remove legacy keys that were absent before a failed import', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', 'previous tasks');
    localStorage.setItem('todo:scopes', 'previous scopes');
    persistenceStatus.mode = 'legacy';
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    setItem.mockImplementation((key, value) => {
      if (key === 'todo:scopes' && value === '[]') {
        throw new Error('storage write failed');
      }

      return originalSetItem.call(localStorage, key, value);
    });

    await expect(
      applyImportedData({ 'todo.it:tasks': {}, 'todo:scopes': [], 'todo:labels': [] }, db, true),
    ).rejects.toThrow('storage write failed');

    expect(removeItem).toHaveBeenCalledWith('todo:labels');
    expect(localStorage.getItem('todo:labels')).toBeNull();
  });

  it('should reject imports without starting persistence when storage is unavailable', async () => {
    const db = await createDatabase();
    persistenceStatus.mode = 'error';

    await expect(applyImportedData({ 'todo.it:tasks': {} }, db)).rejects.toThrow(
      'Import is unavailable while storage is unavailable',
    );
  });

  it('should export current in-memory store data rather than reading localStorage', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useTasksStore().tasks = {
      backlog: {
        items: [{ id: 'memory', description: '', isDone: false, dayId: 'backlog', labels: [] }],
      },
    };
    useLabelsStore().scopes = [{ id: 'scope-memory', name: 'Memory', color: '#000' }];
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const append = vi.spyOn(document.body, 'appendChild');
    const remove = vi.spyOn(document.body, 'removeChild');

    exportData();

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalled();
    expect(append).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    createObjectURL.mockRestore();
    click.mockRestore();
    append.mockRestore();
    remove.mockRestore();
  });

  it('should block export and show an error toast when persistence is in error mode', () => {
    persistenceStatus.mode = 'error';
    const common = useCommonStore();
    const toast = vi.spyOn(common, 'showToast');
    const createObjectURL = vi.spyOn(URL, 'createObjectURL');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    exportData();

    expect(common.status).toBe('error');
    expect(common.message).toBe('Unable to export data while persistence is unavailable.');
    expect(toast).toHaveBeenCalledOnce();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();

    createObjectURL.mockRestore();
    click.mockRestore();
  });
});
