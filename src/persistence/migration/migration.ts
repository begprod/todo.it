import { db } from '@/persistence/db/db';
import type { TodoDatabase } from '@/persistence/db/db';
import {
  canonicalEntityArray,
  canonicalStringify,
  parseEntityArray,
  parseTaskData,
  plainClone,
  taskRowsToMap,
} from '@/persistence/serialize/serialize';
import type { ILabel, IScope, ITask } from '@/types';
import type {
  IMigrationCounts,
  IMigrationMeta,
  IPreMigrationBackup,
  ITaskRow,
} from '@/persistence/types';

export const LEGACY_KEYS = ['todo.it:tasks', 'todo:labels', 'todo:scopes'] as const;
export type LegacyKey = (typeof LEGACY_KEYS)[number];

class InvalidLegacyDataError extends Error {
  constructor(
    readonly key: LegacyKey,
    cause: unknown,
  ) {
    super(cause instanceof Error ? cause.message : `Invalid data at ${key}`);
  }
}

export interface IMigrationResult {
  mode: 'indexeddb' | 'legacy';
  source?: IMigrationMeta['source'];
  error?: Error;
  invalidKeys: Set<LegacyKey>;
  message?: string;
}

const getRawValues = (): Partial<Record<LegacyKey, string>> => {
  const raw: Partial<Record<LegacyKey, string>> = {};

  for (const key of LEGACY_KEYS) {
    const value = localStorage.getItem(key);

    if (value !== null) {
      raw[key] = value;
    }
  }

  return raw;
};

const readLegacyData = (
  raw: Partial<Record<LegacyKey, string>>,
  invalidKeys = new Set<LegacyKey>(),
) => {
  const errors: Array<{ key: LegacyKey; cause: unknown }> = [];
  const parse = <T>(key: LegacyKey, fallback: T): T => {
    if (raw[key] === undefined) {
      return fallback;
    }

    try {
      const value: unknown = JSON.parse(raw[key]);

      if (key === 'todo.it:tasks') {
        return parseTaskData(value) as T;
      }

      if (key === 'todo:labels') {
        return parseEntityArray<ILabel>(value, 'Labels') as T;
      }

      return parseEntityArray<IScope>(value, 'Scopes') as T;
    } catch (error) {
      invalidKeys.add(key);
      errors.push({ key, cause: error });
      return fallback;
    }
  };

  const tasks = parse('todo.it:tasks', {} as Record<string, { items: Array<ITask> }>);
  const labels = parse('todo:labels', [] as Array<ILabel>);
  const scopes = parse('todo:scopes', [] as Array<IScope>);

  if (errors.length) {
    throw new InvalidLegacyDataError(errors[0].key, errors[0].cause);
  }

  return { tasks, labels, scopes };
};

const countRecords = (
  tasks: Record<string, { items: Array<ITask> }>,
  scopes: Array<IScope>,
  labels: Array<ILabel>,
): IMigrationCounts => ({
  days: Object.keys(tasks).length,
  tasks: Object.values(tasks).reduce((total, day) => total + day.items.length, 0),
  scopes: scopes.length,
  labels: labels.length,
});

const removeLegacyKeys = () => {
  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
};

async function cleanLegacyStorage(
  database: TodoDatabase,
  migration: IMigrationMeta,
): Promise<boolean> {
  try {
    removeLegacyKeys();
    await database.transaction('rw', database.meta, async () => {
      await database.meta.put({ ...migration, lsCleaned: true });
    });
    return true;
  } catch {
    return false;
  }
}

export async function migrateLocalStorage(database: TodoDatabase = db): Promise<IMigrationResult> {
  let migration: IMigrationMeta | undefined;
  let imported: ReturnType<typeof readLegacyData> | undefined;
  let raw: Partial<Record<LegacyKey, string>> = {};
  const invalidKeys = new Set<LegacyKey>();
  let hasOrphanBackup = false;
  let hasUnverifiedOrphanWithEmptyStorage = false;
  let hasStoredMigration = false;

  try {
    await database.transaction(
      'rw',
      database.tasks,
      database.scopes,
      database.labels,
      database.meta,
      async () => {
        // Dexie's meta table is a union of records; this key narrows the expected record shape.
        migration = (await database.meta.get('migration.localStorage')) as
          | IMigrationMeta
          | undefined;

        if (migration) {
          hasStoredMigration = true;
          return;
        }

        hasOrphanBackup = Boolean(await database.meta.get('backup.preMigration'));
        raw = getRawValues();

        // A backup without a marker means a previous migration committed its rows but
        // failed verification. Retry from the still-intact legacy source, replacing
        // the potentially partial/unverified rows from that attempt.
        if (hasOrphanBackup && Object.keys(raw).length > 0) {
          imported = readLegacyData(raw, invalidKeys);
          await database.tasks.clear();
          await database.scopes.clear();
          await database.labels.clear();
        } else if (hasOrphanBackup) {
          hasUnverifiedOrphanWithEmptyStorage = true;
          return;
        }

        const [taskCount, scopeCount, labelCount] = await Promise.all([
          database.tasks.count(),
          database.scopes.count(),
          database.labels.count(),
        ]);

        if (!hasOrphanBackup && taskCount + scopeCount + labelCount > 0) {
          if (Object.keys(raw).length > 0) {
            throw new Error('LocalStorage data exists alongside unmarked IndexedDB data');
          }

          const tasks = taskRowsToMap(await database.tasks.toArray());
          const scopes = await database.scopes.toArray();
          const labels = await database.labels.toArray();
          migration = {
            key: 'migration.localStorage',
            status: 'done',
            source: 'existing',
            at: new Date().toISOString(),
            lsCleaned: true,
            counts: countRecords(tasks, scopes, labels),
          };
          await database.meta.put(migration);
          hasStoredMigration = true;

          return;
        }

        if (!imported && Object.keys(raw).length === 0) {
          migration = {
            key: 'migration.localStorage',
            status: 'done',
            source: 'empty',
            at: new Date().toISOString(),
            lsCleaned: true,
            counts: { days: 0, tasks: 0, scopes: 0, labels: 0 },
          };
          await database.meta.put(migration);
          hasStoredMigration = true;

          return;
        }

        if (!imported) {
          imported = readLegacyData(raw, invalidKeys);
        }

        const taskRows: Array<ITaskRow> = Object.entries(imported.tasks).map(([dayId, value]) => ({
          dayId,
          items: plainClone(value.items),
        }));

        if (!hasOrphanBackup) {
          const backup: IPreMigrationBackup = {
            key: 'backup.preMigration',
            at: new Date().toISOString(),
            raw: plainClone(raw),
          };
          // Preserve the first source snapshot so retries cannot erase data removed since then.
          await database.meta.put(backup);
        }

        if (taskRows.length) {
          await database.tasks.bulkPut(plainClone(taskRows));
        }

        if (imported.scopes.length) {
          await database.scopes.bulkPut(plainClone(imported.scopes));
        }

        if (imported.labels.length) {
          await database.labels.bulkPut(plainClone(imported.labels));
        }
      },
    );

    if (hasUnverifiedOrphanWithEmptyStorage) {
      return {
        mode: 'legacy',
        error: new Error('IndexedDB contains unverified data and localStorage is empty'),
        invalidKeys,
      };
    }

    if (hasStoredMigration && migration) {
      if (!migration.lsCleaned) {
        await cleanLegacyStorage(database, migration);
      }

      return { mode: 'indexeddb', source: migration.source, invalidKeys: new Set() };
    }

    if (imported) {
      const persistedTasks = taskRowsToMap(await database.tasks.toArray());
      const persistedScopes = await database.scopes.toArray();
      const persistedLabels = await database.labels.toArray();

      if (
        canonicalStringify(persistedTasks) !== canonicalStringify(imported.tasks) ||
        canonicalEntityArray(persistedScopes) !== canonicalEntityArray(imported.scopes) ||
        canonicalEntityArray(persistedLabels) !== canonicalEntityArray(imported.labels)
      ) {
        throw new Error('IndexedDB migration verification failed');
      }

      const verifiedMigration: IMigrationMeta = {
        key: 'migration.localStorage',
        status: 'done',
        source: 'localStorage',
        at: new Date().toISOString(),
        lsCleaned: false,
        counts: countRecords(imported.tasks, imported.scopes, imported.labels),
      };

      await database.transaction('rw', database.meta, async () => {
        await database.meta.put(verifiedMigration);
      });

      await cleanLegacyStorage(database, verifiedMigration);

      return { mode: 'indexeddb', source: verifiedMigration.source, invalidKeys: new Set() };
    }
  } catch (error) {
    return {
      mode: 'legacy',
      error: error instanceof Error ? error : new Error('IndexedDB migration failed'),
      invalidKeys,
    };
  }

  return { mode: 'legacy', error: new Error('Migration marker was not written'), invalidKeys };
}

export function readLegacyFallback(invalidKeys: Set<LegacyKey>) {
  const parse = <T>(key: LegacyKey, fallback: T): T => {
    if (invalidKeys.has(key)) {
      return fallback;
    }

    let value: string | null;

    try {
      value = localStorage.getItem(key);
    } catch {
      invalidKeys.add(key);
      return fallback;
    }

    if (value === null) {
      return fallback;
    }

    try {
      if (key === 'todo.it:tasks') {
        return parseTaskData(JSON.parse(value)) as T;
      }

      if (key === 'todo:labels') {
        return parseEntityArray<ILabel>(JSON.parse(value), 'Labels') as T;
      }

      return parseEntityArray<IScope>(JSON.parse(value), 'Scopes') as T;
    } catch {
      invalidKeys.add(key);
      return fallback;
    }
  };

  return {
    tasks: parse('todo.it:tasks', {} as Record<string, { items: Array<ITask> }>),
    labels: parse('todo:labels', [] as Array<ILabel>),
    scopes: parse('todo:scopes', [] as Array<IScope>),
  };
}
