import { afterEach, describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import { TodoDatabase } from '@/persistence/db/db';

let database: TodoDatabase | undefined;

afterEach(async () => {
  if (!database) {
    return;
  }

  database.close();
  await database.delete();
  database = undefined;
});

describe('TodoDatabase', () => {
  it('should create stores and support task row operations', async () => {
    database = new TodoDatabase(`todo.it-db-test-${Date.now()}-${Math.random()}`);
    await database.open();

    expect(database.tables.map(({ name }) => name).sort()).toEqual([
      'labels',
      'meta',
      'projects',
      'scopes',
      'tasks',
    ]);

    const row = { dayId: '01012026', items: [] };
    await database.tasks.put(row);
    expect(await database.tasks.get(row.dayId)).toEqual(row);
    await database.tasks.delete(row.dayId);
    expect(await database.tasks.get(row.dayId)).toBeUndefined();
  });

  it('should upgrade an existing version 1 database without losing data', async () => {
    const name = `todo.it-db-upgrade-test-${Date.now()}-${Math.random()}`;
    const legacyDatabase = new Dexie(name);

    legacyDatabase.version(1).stores({
      tasks: 'dayId',
      scopes: 'id',
      labels: 'id',
      meta: 'key',
    });

    await legacyDatabase.open();

    const row = { dayId: 'backlog', items: [] };

    await legacyDatabase.table<{ dayId: string; items: Array<never> }>('tasks').put(row);

    legacyDatabase.close();

    database = new TodoDatabase(name);

    await database.open();

    expect(database.tables.map(({ name: tableName }) => tableName).sort()).toEqual([
      'labels',
      'meta',
      'projects',
      'scopes',
      'tasks',
    ]);
    expect(await database.tasks.get('backlog')).toEqual(row);
  });
});
