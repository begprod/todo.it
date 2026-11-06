import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { useCommonStore, useLabelsStore, useProjectsStore, useTasksStore } from '@/stores';
import type { IProject, ITask } from '@/types';
import { TodoDatabase } from '@/persistence/db/db';
import { initPersistence, persistenceStatus } from '@/persistence';
import { applyImportedData } from '@/persistence/backup/backup';
import { hydrateFromDatabase, startPersistence, stopPersistence } from '@/persistence/sync/sync';
import * as sync from '@/persistence/sync/sync';

let database: TodoDatabase;
let databaseSequence = 0;
let visibilityStateDescriptor: PropertyDescriptor | undefined;

const createDatabase = async () => {
  database = new TodoDatabase(`todo.it-sync-test-${Date.now()}-${databaseSequence++}`);
  await database.open();
  return database;
};

const createTask = (id: string, dayId = '01012026'): ITask => ({
  id,
  description: id,
  isDone: false,
  dayId,
  labels: [],
});

const advanceAutosave = async () => {
  await nextTick();
  await vi.advanceTimersByTimeAsync(300);
  await database.transaction(
    'r',
    database.tasks,
    database.scopes,
    database.labels,
    database.projects,
    async () => {},
  );
};

afterEach(async () => {
  stopPersistence();

  if (visibilityStateDescriptor) {
    Object.defineProperty(document, 'visibilityState', visibilityStateDescriptor);
    visibilityStateDescriptor = undefined;
  } else {
    Reflect.deleteProperty(document, 'visibilityState');
  }

  localStorage.clear();
  persistenceStatus.mode = 'indexeddb';
  persistenceStatus.error = undefined;
  vi.restoreAllMocks();
  vi.useRealTimers();

  if (database) {
    database.close();
    await database.delete();
  }
});

describe('IndexedDB autosave', () => {
  it('should save and remove projects from IndexedDB', async () => {
    const db = await createDatabase();
    const pinia = createPinia();

    setActivePinia(pinia);

    const projects = useProjectsStore();
    const project: IProject = {
      id: 'project-one',
      title: 'Project one',
      color: '#123456',
      priority: 3,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);

    projects.createProject(project);
    await advanceAutosave();

    expect(await db.projects.get(project.id)).toEqual(project);

    projects.projects = [];
    await advanceAutosave();

    expect(await db.projects.get(project.id)).toBeUndefined();
  });

  it('should hydrate projects from IndexedDB', async () => {
    const db = await createDatabase();
    const pinia = createPinia();

    setActivePinia(pinia);

    const project: IProject = {
      id: 'stored-project',
      title: 'Stored project',
      color: '#654321',
      priority: 2,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };

    await db.projects.put(project);
    await hydrateFromDatabase(pinia, db);

    expect(useProjectsStore(pinia).projects).toEqual([project]);
  });

  it('should save only the changed day record', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    tasks.tasks = { '01012026': { items: [createTask('a')] }, backlog: { items: [] } };
    await db.tasks.bulkPut([
      { dayId: '01012026', items: [createTask('a')] },
      { dayId: 'backlog', items: [] },
    ]);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);
    const putSpy = vi.spyOn(db.tasks, 'bulkPut');
    tasks.tasks['01012026'].items[0].description = 'changed';

    await advanceAutosave();

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy.mock.calls[0][0]).toEqual([
      { dayId: '01012026', items: [expect.objectContaining({ description: 'changed' })] },
    ]);
    expect((await db.tasks.get('backlog'))?.items).toEqual([]);
  });

  it('should delete removed days and save label and scope additions and removals', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    const labels = useLabelsStore();
    tasks.tasks = { '01012026': { items: [] }, backlog: { items: [] } };
    labels.scopes = [{ id: 'scope-old', name: 'Old', color: '#000' }];
    labels.labels = [{ id: 'label-old', name: 'Old', color: '#000', scopeTitle: null }];
    await db.tasks.bulkPut([
      { dayId: '01012026', items: [] },
      { dayId: 'backlog', items: [] },
    ]);
    await db.scopes.put({ id: 'scope-old', name: 'Old', color: '#000' });
    await db.labels.put({ id: 'label-old', name: 'Old', color: '#000', scopeTitle: null });
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);
    const taskDelete = vi.spyOn(db.tasks, 'delete');
    const scopeDelete = vi.spyOn(db.scopes, 'delete');
    const labelDelete = vi.spyOn(db.labels, 'delete');
    const scopePut = vi.spyOn(db.scopes, 'bulkPut');
    const labelPut = vi.spyOn(db.labels, 'bulkPut');

    delete tasks.tasks['01012026'];
    labels.scopes = [{ id: 'scope-new', name: 'New', color: '#fff' }];
    labels.labels = [{ id: 'label-new', name: 'New', color: '#fff', scopeTitle: null }];
    await advanceAutosave();

    expect(taskDelete).toHaveBeenCalledWith('01012026');
    expect(scopeDelete).toHaveBeenCalledWith('scope-old');
    expect(labelDelete).toHaveBeenCalledWith('label-old');
    expect(scopePut).toHaveBeenCalledWith([{ id: 'scope-new', name: 'New', color: '#fff' }]);
    expect(labelPut).toHaveBeenCalledWith([
      { id: 'label-new', name: 'New', color: '#fff', scopeTitle: null },
    ]);
  });

  it('should persist a task moved to backlog in both affected records', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    tasks.tasks = { '01012026': { items: [createTask('moving')] }, backlog: { items: [] } };
    await db.tasks.bulkPut([
      { dayId: '01012026', items: [createTask('moving')] },
      { dayId: 'backlog', items: [] },
    ]);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);
    tasks.moveToBacklog('moving', '01012026');

    await advanceAutosave();
    expect((await db.tasks.get('01012026'))?.items).toEqual([]);
    expect((await db.tasks.get('backlog'))?.items[0].dayId).toBe('backlog');
  });

  it('should fall back to localStorage when IndexedDB cannot be opened', async () => {
    const db = new TodoDatabase(`todo.it-unavailable-test-${Date.now()}-${databaseSequence++}`);
    database = db;
    vi.spyOn(db, 'open').mockRejectedValue(new Error('blocked'));
    localStorage.setItem(
      'todo.it:tasks',
      JSON.stringify({ backlog: { items: [createTask('legacy', 'backlog')] } }),
    );
    const pinia = createPinia();
    setActivePinia(pinia);

    await initPersistence(pinia, db);

    expect(persistenceStatus.mode).toBe('legacy');
    expect(useTasksStore().tasks.backlog.items[0].id).toBe('legacy');
    expect(localStorage.getItem('todo.it:tasks')).not.toBeNull();
  });

  it('should show a success toast only after a localStorage migration is hydrated', async () => {
    const db = await createDatabase();
    localStorage.setItem(
      'todo.it:tasks',
      JSON.stringify({ backlog: { items: [createTask('migrated', 'backlog')] } }),
    );
    const pinia = createPinia();
    setActivePinia(pinia);
    const common = useCommonStore(pinia);
    const toast = vi.spyOn(common, 'showToast');

    await initPersistence(pinia, db);

    expect(common.message).toBe('Data moved to IndexedDB');
    expect(common.status).toBe('success');
    expect(toast).toHaveBeenCalledTimes(1);
    expect(useTasksStore(pinia).tasks.backlog.items[0].id).toBe('migrated');
  });

  it.each(['empty', 'existing'] as const)(
    'should not show a migration toast for %s IndexedDB data',
    async (source) => {
      const db = await createDatabase();

      if (source === 'existing') {
        await db.tasks.put({ dayId: 'backlog', items: [] });
      }

      const pinia = createPinia();
      setActivePinia(pinia);
      const common = useCommonStore(pinia);
      const toast = vi.spyOn(common, 'showToast');

      await initPersistence(pinia, db);

      expect(toast).not.toHaveBeenCalled();
      expect(common.message).not.toBe('Data moved to IndexedDB');
    },
  );

  it('should show only the fallback error toast for invalid legacy data', async () => {
    const db = await createDatabase();
    localStorage.setItem('todo.it:tasks', '{broken');
    const pinia = createPinia();
    setActivePinia(pinia);
    const common = useCommonStore(pinia);
    const toast = vi.spyOn(common, 'showToast');

    await initPersistence(pinia, db);

    expect(toast).toHaveBeenCalledOnce();
    expect(common.message).toContain('Data migration failed; using local storage');
    expect(common.message).not.toBe('Data moved to IndexedDB');
  });

  it('should flush pending changes on pagehide and hidden visibilitychange', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    tasks.tasks = { backlog: { items: [createTask('original', 'backlog')] } };
    await db.tasks.put({ dayId: 'backlog', items: [createTask('original', 'backlog')] });
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);

    tasks.tasks.backlog.items[0].description = 'pagehide';
    await nextTick();
    window.dispatchEvent(new Event('pagehide'));
    await vi.advanceTimersByTimeAsync(0);
    expect((await db.tasks.get('backlog'))?.items[0].description).toBe('pagehide');

    tasks.tasks.backlog.items[0].description = 'hidden';
    await nextTick();
    visibilityStateDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);
    expect((await db.tasks.get('backlog'))?.items[0].description).toBe('hidden');
  });

  it('should block all further writes and show one export toast after a save failure', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    tasks.tasks = { backlog: { items: [createTask('task', 'backlog')] } };
    await db.tasks.put({ dayId: 'backlog', items: [createTask('task', 'backlog')] });
    const common = useCommonStore();
    const toast = vi.spyOn(common, 'showToast');
    const put = vi.spyOn(db.tasks, 'bulkPut').mockRejectedValue(new Error('quota exceeded'));
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);

    tasks.tasks.backlog.items[0].description = 'first edit';
    await advanceAutosave();
    tasks.tasks.backlog.items[0].description = 'second edit';
    await advanceAutosave();

    expect(put).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledTimes(1);
    expect(common.message).toContain('Please export your data');
    expect((await db.tasks.get('backlog'))?.items[0].description).toBe('task');
    expect(tasks.tasks.backlog.items[0].description).toBe('second edit');
  });

  it('should not start autosave or fall back to empty localStorage after committed migration hydration fails', async () => {
    const db = await createDatabase();
    localStorage.setItem(
      'todo.it:tasks',
      JSON.stringify({ backlog: { items: [createTask('migrated', 'backlog')] } }),
    );
    const originalToArray = db.tasks.toArray.bind(db.tasks);
    const read = vi
      .spyOn(db.tasks, 'toArray')
      .mockImplementationOnce(originalToArray)
      .mockRejectedValue(new Error('hydration read failed'));
    const start = vi.spyOn(sync, 'startPersistence');
    const pinia = createPinia();
    setActivePinia(pinia);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);

    await initPersistence(pinia, db);
    useTasksStore(pinia).tasks.backlog = { items: [createTask('memory', 'backlog')] };
    const put = vi.spyOn(db.tasks, 'bulkPut');
    await advanceAutosave();

    expect(read).toHaveBeenCalledTimes(3);
    expect(start).toHaveBeenCalledTimes(1);
    expect(put).not.toHaveBeenCalled();
    expect(persistenceStatus.mode).toBe('error');
    expect(localStorage.getItem('todo.it:tasks')).toBeNull();
    expect(await db.tasks.get('backlog')).toMatchObject({
      items: [expect.objectContaining({ id: 'migrated' })],
    });
    expect(useCommonStore(pinia).message).toBe(
      'Unable to read data. Reload the page. Export is unavailable.',
    );
  });

  it('should cancel a pending autosave before importing replacement data', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore();
    tasks.tasks = { backlog: { items: [createTask('old', 'backlog')] } };
    await db.tasks.put({ dayId: 'backlog', items: [createTask('old', 'backlog')] });
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const put = vi.spyOn(db.tasks, 'bulkPut');
    startPersistence(pinia, db, false);
    tasks.tasks.backlog.items[0].description = 'stale pending value';
    await nextTick();
    await applyImportedData(
      { 'todo.it:tasks': { backlog: { items: [createTask('imported', 'backlog')] } } },
      db,
    );

    window.dispatchEvent(new Event('pagehide'));
    await vi.advanceTimersByTimeAsync(300);

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith([
      { dayId: 'backlog', items: [expect.objectContaining({ id: 'imported' })] },
    ]);
    expect((await db.tasks.get('backlog'))?.items[0].id).toBe('imported');
  });

  it('should restart autosave after an import transaction fails', async () => {
    const db = await createDatabase();
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore(pinia);
    tasks.tasks = { backlog: { items: [createTask('original', 'backlog')] } };
    await db.tasks.put({ dayId: 'backlog', items: [createTask('original', 'backlog')] });
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    startPersistence(pinia, db, false);
    const transaction = vi
      .spyOn(db, 'transaction')
      .mockRejectedValueOnce(new Error('import transaction failed'));

    await expect(
      applyImportedData(
        { 'todo.it:tasks': { backlog: { items: [createTask('imported', 'backlog')] } } },
        db,
      ),
    ).rejects.toThrow('import transaction failed');

    transaction.mockRestore();

    tasks.tasks.backlog.items[0].description = 'edited after failed import';
    await advanceAutosave();
    expect((await db.tasks.get('backlog'))?.items[0].description).toBe(
      'edited after failed import',
    );
  });

  it('should not autosave edits after initPersistence fails and an import is rejected', async () => {
    const db = await createDatabase();
    localStorage.setItem(
      'todo.it:tasks',
      JSON.stringify({ backlog: { items: [createTask('migrated', 'backlog')] } }),
    );
    const originalToArray = db.tasks.toArray.bind(db.tasks);
    vi.spyOn(db.tasks, 'toArray')
      .mockImplementationOnce(originalToArray)
      .mockRejectedValue(new Error('hydration read failed'));
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore(pinia);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    await initPersistence(pinia, db);
    tasks.tasks = { backlog: { items: [createTask('memory', 'backlog')] } };

    const start = vi.spyOn(sync, 'startPersistence');
    const put = vi.spyOn(db.tasks, 'bulkPut');

    await expect(applyImportedData({ 'todo.it:tasks': {} }, db)).rejects.toThrow(
      'Import is unavailable while storage is unavailable',
    );
    tasks.tasks.backlog.items.push(createTask('new', 'backlog'));
    await advanceAutosave();

    expect(start).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
    expect(persistenceStatus.mode).toBe('error');
    expect((await db.tasks.get('backlog'))?.items[0].id).toBe('migrated');
  });

  it('should preserve invalid legacy data after a failed import and subsequent edit', async () => {
    const db = await createDatabase();
    const invalidRawTasks = '{broken';
    localStorage.setItem('todo.it:tasks', invalidRawTasks);
    persistenceStatus.mode = 'indexeddb';
    const pinia = createPinia();
    setActivePinia(pinia);
    const tasks = useTasksStore(pinia);
    await initPersistence(pinia, db);
    expect(persistenceStatus.mode).toBe('legacy');

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementation((key, value) => {
      if (key === 'todo:scopes' && value === '[]') {
        throw new Error('storage write failed');
      }

      return originalSetItem.call(localStorage, key, value);
    });

    await expect(
      applyImportedData({ 'todo.it:tasks': {}, 'todo:scopes': [] }, db, true),
    ).rejects.toThrow('storage write failed');

    setItem.mockRestore();
    tasks.tasks.backlog = { items: [createTask('edited', 'backlog')] };
    await advanceAutosave();

    expect(localStorage.getItem('todo.it:tasks')).toBe(invalidRawTasks);
    expect(localStorage.getItem('todo:labels')).toBe('[]');
  });
});
