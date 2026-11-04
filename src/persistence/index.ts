import type { Pinia } from 'pinia';
import { useCommonStore } from '@/stores';
import { db, openDb, requestPersistentStorage } from '@/persistence/db/db';
import { migrateLocalStorage } from '@/persistence/migration/migration';
import {
  hydrateFromDatabase,
  hydrateLegacy,
  startPersistence,
  stopPersistence,
} from '@/persistence/sync/sync';
import type { IPersistenceStatus } from '@/persistence/types';

export const persistenceStatus: IPersistenceStatus = { mode: 'indexeddb' };

export async function initPersistence(pinia: Pinia, database = db): Promise<void> {
  try {
    await openDb(database);
  } catch (error) {
    persistenceStatus.mode = 'legacy';
    persistenceStatus.error = error instanceof Error ? error : new Error('IndexedDB unavailable');
    const common = useCommonStore(pinia);
    common.setMessage('IndexedDB is unavailable; using local storage. Export your data regularly.');
    common.setStatus('error');
    common.showToast();
    hydrateLegacy(pinia);
    startPersistence(pinia, database, true);
    return;
  }

  void requestPersistentStorage();
  const migration = await migrateLocalStorage(database);

  if (migration.mode === 'legacy') {
    persistenceStatus.mode = 'legacy';
    persistenceStatus.error = migration.error;
    const common = useCommonStore(pinia);
    common.setMessage(
      `Data migration failed; using local storage: ${migration.error?.message ?? 'unknown error'}`,
    );
    common.setStatus('error');
    common.showToast();
    hydrateLegacy(pinia, migration.invalidKeys);
    startPersistence(pinia, database, true, migration.invalidKeys);
    return;
  }

  persistenceStatus.mode = 'indexeddb';
  persistenceStatus.error = undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await hydrateFromDatabase(pinia, database);

      if (migration.source === 'localStorage') {
        const common = useCommonStore(pinia);
        common.setMessage('Data moved to IndexedDB');
        common.setStatus('success');
        common.showToast();
      }

      startPersistence(pinia, database, false);
      return;
    } catch (error) {
      if (attempt === 1) {
        stopPersistence();
        persistenceStatus.mode = 'error';
        persistenceStatus.error = error instanceof Error ? error : new Error('Unable to read data');
        const common = useCommonStore(pinia);
        common.setMessage('Unable to read data. Reload the page. Export is unavailable.');
        common.setStatus('error');
        common.showToast();
        return;
      }
    }
  }
}

export { flush } from '@/persistence/sync/sync';
