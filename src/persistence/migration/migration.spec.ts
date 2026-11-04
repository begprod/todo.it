import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCalendarStore, useTasksStore } from '@/stores';
import { TodoDatabase } from '@/persistence/db/db';
import { backupFixture } from '@/persistence/migration/backup.fixture';
import { migrateLocalStorage } from '@/persistence/migration/migration';

let database: TodoDatabase;
let databaseSequence = 0;

const createDatabase = () => {
  database = new TodoDatabase(`todo.it-migration-test-${Date.now()}-${databaseSequence++}`);
  return database.open().then(() => database);
};

afterEach(async () => {
  localStorage.clear();

  if (database) {
    database.close();
    await database.delete();
  }
});

describe('localStorage migration', () => {
  it('should write only an empty marker when localStorage is empty', async () => {
    const db = await createDatabase();
    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect(await db.meta.get('migration.localStorage')).toMatchObject({
      source: 'empty',
      lsCleaned: true,
    });
    expect(await db.meta.get('backup.preMigration')).toBeUndefined();
    expect(await db.tasks.count()).toBe(0);
  });

  it('should migrate and verify the backup fixture', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', JSON.stringify(backupFixture['todo.it:tasks']));
    localStorage.setItem('todo:labels', JSON.stringify(backupFixture['todo:labels']));
    localStorage.setItem('todo:scopes', JSON.stringify(backupFixture['todo:scopes']));

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect(await db.tasks.count()).toBe(3);
    expect(await db.tasks.get('backlog')).toBeDefined();
    expect(await db.scopes.count()).toBe(2);
    expect(await db.labels.count()).toBe(2);
    expect(await db.meta.get('migration.localStorage')).toMatchObject({
      source: 'localStorage',
      counts: { days: 3, tasks: 3, scopes: 2, labels: 2 },
      lsCleaned: true,
    });
    expect(await db.meta.get('backup.preMigration')).toMatchObject({
      raw: {
        'todo.it:tasks': JSON.stringify(backupFixture['todo.it:tasks']),
        'todo:labels': JSON.stringify(backupFixture['todo:labels']),
        'todo:scopes': JSON.stringify(backupFixture['todo:scopes']),
      },
    });
    expect(localStorage.getItem('todo.it:tasks')).toBeNull();
    expect(localStorage.getItem('todo:labels')).toBeNull();
    expect(localStorage.getItem('todo:scopes')).toBeNull();
  });

  it('should accept a partial legacy-key set and initialize absent data as empty', async () => {
    const db = await createDatabase();
    localStorage.setItem(
      'todo:scopes',
      JSON.stringify([{ id: 'scope-1', name: 'Scope', color: '#000' }]),
    );

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect(await db.scopes.count()).toBe(1);
    expect(await db.labels.count()).toBe(0);
    expect(await db.tasks.count()).toBe(0);
    expect(await db.meta.get('backup.preMigration')).toMatchObject({
      raw: { 'todo:scopes': expect.any(String) },
    });
  });

  it('should preserve invalid legacy data and abort migration', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', '{broken');
    localStorage.setItem(
      'todo:scopes',
      JSON.stringify([{ id: 'scope', name: 'Scope', color: '#000' }]),
    );
    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('legacy');
    expect([...result.invalidKeys]).toEqual(['todo.it:tasks']);
    expect(localStorage.getItem('todo.it:tasks')).toBe('{broken');
    expect(localStorage.getItem('todo:scopes')).not.toBeNull();
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
    expect(await db.tasks.count()).toBe(0);
  });

  it('should be idempotent and not read or overwrite localStorage after completion', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', JSON.stringify({ backlog: { items: [] } }));
    await migrateLocalStorage(db);
    await db.tasks.put({
      dayId: 'backlog',
      items: [{ id: 'persisted', description: '', dayId: 'backlog', isDone: false, labels: [] }],
    });
    localStorage.setItem('todo.it:tasks', '{not read');

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect((await db.tasks.get('backlog'))?.items[0].id).toBe('persisted');
    expect(localStorage.getItem('todo.it:tasks')).toBe('{not read');
  });

  it('should preserve localStorage when unmarked IndexedDB data already exists', async () => {
    const db = await createDatabase();
    await db.tasks.put({ dayId: 'backlog', items: [] });
    localStorage.setItem('todo.it:tasks', JSON.stringify({ backlog: { items: [] } }));

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('legacy');
    expect(localStorage.getItem('todo.it:tasks')).not.toBeNull();
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
  });

  it('should retry localStorage cleanup when the marker is not cleaned', async () => {
    const db = await createDatabase();
    await db.tasks.put({ dayId: 'backlog', items: [] });
    await db.meta.put({
      key: 'migration.localStorage',
      status: 'done',
      source: 'localStorage',
      at: new Date().toISOString(),
      lsCleaned: false,
      counts: { days: 1, tasks: 0, scopes: 0, labels: 0 },
    });
    localStorage.setItem('todo.it:tasks', 'must not be read');
    localStorage.setItem('todo:labels', 'also removed');

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect(localStorage.length).toBe(0);
    expect(await db.meta.get('migration.localStorage')).toMatchObject({ lsCleaned: true });
    expect((await db.tasks.get('backlog'))?.items).toEqual([]);
  });

  it('should keep localStorage when read-back verification fails', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', JSON.stringify({ backlog: { items: [] } }));
    db.tasks.hook('creating', (_key, row) => {
      row.items.push({
        id: 'tampered',
        description: '',
        dayId: 'backlog',
        isDone: false,
        labels: [],
      });
    });

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('legacy');
    expect(result.error?.message).toContain('verification');
    expect(localStorage.getItem('todo.it:tasks')).not.toBeNull();
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
    const retry = await migrateLocalStorage(db);
    expect(retry.mode).toBe('legacy');
    expect(localStorage.getItem('todo.it:tasks')).not.toBeNull();
  });

  it('should not create a marker after a read-back exception and keep localStorage intact', async () => {
    const db = await createDatabase();
    const taskData = {
      backlog: {
        items: [
          { id: 'legacy-task', description: 'kept', isDone: false, dayId: 'backlog', labels: [] },
        ],
      },
    };
    localStorage.setItem('todo.it:tasks', JSON.stringify(taskData));
    const toArray = vi.spyOn(db.tasks, 'toArray').mockRejectedValueOnce(new Error('read failed'));

    const failed = await migrateLocalStorage(db);

    expect(failed.mode).toBe('legacy');
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
    expect(await db.meta.get('backup.preMigration')).toBeDefined();
    expect(localStorage.getItem('todo.it:tasks')).toBe(JSON.stringify(taskData));

    toArray.mockRestore();
    const retry = await migrateLocalStorage(db);

    expect(retry.mode).toBe('indexeddb');
    expect((await db.tasks.get('backlog'))?.items).toEqual(taskData.backlog.items);
    expect(localStorage.getItem('todo.it:tasks')).toBeNull();
  });

  it('should preserve the first pre-migration backup when retrying an orphaned migration', async () => {
    const db = await createDatabase();
    const originalRaw = JSON.stringify({ backlog: { items: [] } });
    localStorage.setItem('todo.it:tasks', originalRaw);
    const toArray = vi.spyOn(db.tasks, 'toArray').mockRejectedValueOnce(new Error('read failed'));

    const failed = await migrateLocalStorage(db);

    expect(failed.mode).toBe('legacy');
    const refreshedRaw = JSON.stringify({
      backlog: {
        items: [{ id: 'updated', description: '', isDone: false, dayId: 'backlog', labels: [] }],
      },
    });
    localStorage.setItem('todo.it:tasks', refreshedRaw);
    toArray.mockRestore();

    const retry = await migrateLocalStorage(db);

    expect(retry.mode).toBe('indexeddb');
    expect(await db.meta.get('backup.preMigration')).toMatchObject({
      raw: { 'todo.it:tasks': originalRaw },
    });
    expect((await db.tasks.get('backlog'))?.items[0].id).toBe('updated');
  });

  it('should report unverified IndexedDB data when orphan backup has no localStorage data', async () => {
    const db = await createDatabase();
    await db.meta.put({
      key: 'backup.preMigration',
      at: new Date().toISOString(),
      raw: { 'todo.it:tasks': '{"backlog":{"items":[]}}' },
    });

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('legacy');
    expect(result.error?.message).toBe(
      'IndexedDB contains unverified data and localStorage is empty',
    );
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
  });

  it('should mark existing IndexedDB records without removing other localStorage keys', async () => {
    const db = await createDatabase();
    await db.tasks.put({ dayId: 'outside-window', items: [] });
    localStorage.setItem('todo.it:currentViewType', 'columns');

    const result = await migrateLocalStorage(db);

    expect(result).toMatchObject({ mode: 'indexeddb', source: 'existing' });
    expect(await db.meta.get('migration.localStorage')).toMatchObject({ source: 'existing' });
    expect(await db.tasks.get('outside-window')).toEqual({ dayId: 'outside-window', items: [] });
    expect(localStorage.getItem('todo.it:currentViewType')).toBe('columns');
  });

  it('should preserve legacy data when writing migration rows fails', async () => {
    const db = await createDatabase();
    const raw = JSON.stringify({ backlog: { items: [] } });
    localStorage.setItem('todo.it:tasks', raw);
    db.tasks.hook('creating', () => {
      throw new Error('quota exceeded');
    });

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('legacy');
    expect(localStorage.getItem('todo.it:tasks')).toBe(raw);
    expect(await db.meta.get('migration.localStorage')).toBeUndefined();
  });

  it('should migrate dates outside the active calendar window without cleanup', async () => {
    const db = await createDatabase();
    const tasks = { '01011990': { items: [] }, backlog: { items: [] } };
    localStorage.setItem('todo.it:tasks', JSON.stringify(tasks));

    const result = await migrateLocalStorage(db);

    expect(result.mode).toBe('indexeddb');
    expect(await db.tasks.get('01011990')).toEqual({ dayId: '01011990', items: [] });
  });

  it('should retain the pre-migration backup after store initialization and cleanup', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', JSON.stringify({ '01011990': { items: [] } }));
    await migrateLocalStorage(db);
    const backup = await db.meta.get('backup.preMigration');
    const pinia = createPinia();
    setActivePinia(pinia);
    useCalendarStore(pinia).initCalendar();
    const tasks = useTasksStore(pinia);
    tasks.tasks = { '01011990': { items: [] } };

    tasks.initTasksObject();

    expect(tasks.tasks['01011990']).toBeUndefined();
    expect(await db.meta.get('backup.preMigration')).toEqual(backup);
  });
});
