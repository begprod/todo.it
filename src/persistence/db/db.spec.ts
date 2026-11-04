import { afterEach, describe, expect, it } from 'vitest';
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
      'scopes',
      'tasks',
    ]);

    const row = { dayId: '01012026', items: [] };
    await database.tasks.put(row);
    expect(await database.tasks.get(row.dayId)).toEqual(row);
    await database.tasks.delete(row.dayId);
    expect(await database.tasks.get(row.dayId)).toBeUndefined();
  });
});
