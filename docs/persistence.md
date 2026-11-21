---
description: Persistence architecture, storage formats, migration, and backup behavior.
tags: [persistence, dexie]
---

# Persistence

> Author: AI

`todo.it` is client-only and has no API. User data lives in IndexedDB (Dexie). `localStorage` holds UI settings and the legacy data that is migrated once. Code: `src/persistence/`, public API in `src/persistence/index.ts`.

Persistence modules follow `src/persistence/<module>/<module>.ts` with a co-located spec (`db`, `serialize`, `migration`, `sync`, `backup`). Dependencies flow one way: `main → persistence → stores`; stores and components do not import Dexie.

## Storage

IndexedDB database `todo.it` (`src/persistence/db/db.ts`), Dexie schema version 2:

| Table      | Key path | Content                                   | Added in |
| ---------- | -------- | ----------------------------------------- | -------- |
| `tasks`    | `dayId`  | One row per day: `{ dayId, items }`       | v1       |
| `scopes`   | `id`     | Label scopes                              | v1       |
| `labels`   | `id`     | Labels                                    | v1       |
| `meta`     | `key`    | Migration marker and pre-migration backup | v1       |
| `projects` | `id`     | Projects                                  | v2       |

UI settings (`todo.it:currentViewType`, `todo.it:lastUpdateDate`) stay in `localStorage` through `@vueuse/core`.
After `openDb` succeeds, `requestPersistentStorage()` makes a best-effort `navigator.storage.persist()` request (`src/persistence/db/db.ts`). Task `dayId` values use `ddMMyyyy`, plus the literal `'backlog'` (`src/persistence/`).

## Bootstrap

`src/main.ts` awaits `initPersistence()` before mounting the app. Steps in `src/persistence/index.ts`:

1. `openDb` opens the database (5 s timeout, `blocked` is treated as an error).
2. `migrateLocalStorage` (`src/persistence/migration/migration.ts`) moves legacy data into IndexedDB once.
3. `hydrateFromDatabase` reads all four data tables into the Pinia stores. It is tried twice.
4. `startPersistence` starts the autosave watcher.

`persistenceStatus.mode` is one of:

| Mode        | When                                                                             | Behavior                                                                                                                                         |
| ----------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `indexeddb` | Normal path                                                                      | Data is read from and saved to IndexedDB.                                                                                                        |
| `legacy`    | `openDb` fails, or the migration fails                                           | Data is read from and saved to the three legacy `localStorage` keys. Projects are not persisted (`hydrateLegacy` sets `projects: []`). An `openDb` failure shows a toast recommending regular exports; a migration failure shows a toast with the migration error (`src/persistence/index.ts`). |
| `error`     | Hydration from IndexedDB fails twice                                             | Autosave is stopped. Export and import are blocked with an error message.                                                                        |

## Autosave

`src/persistence/sync/sync.ts`:

- `startPersistence` deep-watches the tasks, scopes, labels and projects stores.
- Changes are debounced by 300 ms (`scheduleSave`).
- `saveDiff` compares a snapshot with the last saved state. It diffs entities by `id` and tasks by day, then writes the changes in one `rw` transaction (`bulkPut` and `delete`).
- `flush` runs on `pagehide` and on `visibilitychange` to `hidden`.
- If a save fails, saving is blocked, the watcher is stopped, and a toast asks the user to export data.
- In `legacy` mode `writeLegacyState` serializes the entire current state to the three legacy keys, then updates `savedState` and returns; it does not write a diff (`src/persistence/sync/sync.ts`).

## Legacy data and migration

| Legacy key       | Content                       |
| ---------------- | ----------------------------- |
| `todo.it:tasks`  | Tasks keyed by day id         |
| `todo:scopes`    | Scopes                        |
| `todo:labels`    | Labels                        |

These key names are inconsistent but are part of the migration and backup formats. Do not rename them.

`migrateLocalStorage` writes two records to `meta`:

- `backup.preMigration`: the raw `localStorage` strings before migration. It is written in the same transaction as the migrated rows, once, and is never deleted.
- `migration.localStorage`: the marker with `status: 'done'`, `source` (`localStorage`, `empty` or `existing`), and record counts.

The marker is written after the migrated rows are read back and verified against the source. Then the three legacy keys are removed from `localStorage`. If cleanup fails, `lsCleaned` stays `false` and cleanup is retried on the next start.

Migration can return `legacy` mode if `backup.preMigration` is unverifiable while `localStorage` is empty, data is invalid or verification fails, unmarked IndexedDB data exists alongside `localStorage` data, or the migration marker cannot be written (`src/persistence/migration/migration.ts`). The app then keeps working on `localStorage`.

When reading legacy data, `readLegacyFallback` supplies an empty fallback for keys in `invalidKeys`; `writeLegacyState` skips those keys so unreadable data is not overwritten (`src/persistence/migration/migration.ts`, `src/persistence/sync/sync.ts`).

The term “mode” is used in three places: `IMigrationResult.mode` is one startup migration attempt's result; `persistenceStatus.mode` is session state read by export/import UI functions; and `legacyMode` in `sync.ts` routes autosave writes and is set only by `startPersistence(isLegacy)`. The `status legacy ⇔ legacyMode` invariant is not checked. `applyImportedData` receives `legacyMode` as a parameter, derived by `importData` from `persistenceStatus.mode` (`src/persistence/migration/migration.ts`, `src/persistence/index.ts`, `src/persistence/sync/sync.ts`, `src/persistence/backup/backup.ts`).

Projects have no legacy key and are not part of the migration.

## Export and import

Code: `src/persistence/backup/backup.ts`, payload helpers in `src/persistence/serialize/serialize.ts`, UI in `src/components/BaseSettings/partials/BaseSettingsBackup/BaseSettingsBackup.vue`.

Export downloads `todo.it.backup.<YYYY-MM-DD>.json` built from the in-memory stores (not from storage). The format is a JSON object with these keys:

| Key              | Content                           | Validation (`serialize.ts`)                      |
| ---------------- | --------------------------------- | ------------------------------------------------ |
| `todo.it:tasks`  | `{ [dayId]: { items: ITask[] } }` | `parseTaskData`: object whose values have `items` arrays |
| `todo:scopes`    | `IScope[]`                        | `parseEntityArray`: array of objects with string `id`    |
| `todo:labels`    | `ILabel[]`                        | `parseEntityArray`                               |
| `todo:projects`  | `IProject[]`                      | `parseEntityArray`                               |

Import rules (`applyImportedData`):

- The file must be a JSON object.
- Import is a partial replace. A key that is present replaces the whole table (`clear()` and `bulkPut`). A key that is absent leaves that table untouched. An empty array or object clears the table.
- Unknown keys are ignored. `meta` is never touched.
- All keys are validated before any write. All tables are written in one `rw` transaction, so an invalid or failing import changes nothing.
- Only the shape is validated. Field contents are not checked. In particular, `ITask.projectId` is not checked against the projects in the file or in the database.
- Autosave is stopped and the pending save is awaited before the write. It is restarted if the import fails.
- After a successful import in `legacy` mode autosave is not restarted; `BaseSettingsBackup.vue` reloads the page to restore the session.
- After a successful import the settings UI calls `location.reload()` to rehydrate the stores.

Behavior in `legacy` mode:

| Operation | Behavior                                                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Export    | `todo:projects` is not included, because projects are not persisted in this mode. Importing such a file on a healthy device would otherwise wipe real projects. |
| Import    | Present tasks, scopes and labels keys are written to `localStorage` (with rollback if a write fails). `todo:projects` is ignored: it is not parsed, written or reported as an error. |

In `error` mode export shows an error toast and import throws.

## Limitations

- Backups made before projects were added have no `todo:projects` key. Importing them keeps the current projects.
- After an import, tasks can reference a `projectId` that does not exist. The UI tolerates this: `BaseTask.vue` renders no project badge for an unknown id.
- Projects are not in the legacy `localStorage` format, so they are lost if the app has to run in `legacy` mode.
- Projects can be created during a legacy session and remain visible until reload, but autosave ignores them; `hydrateLegacy` restores `projects: []` (`src/persistence/sync/sync.ts`).
- Legacy mode has no migration marker in IndexedDB. If IndexedDB is available on a later start, localStorage data is migrated then; projects created during the legacy session have already been lost because they had nowhere to persist (`src/persistence/migration/migration.ts`).

## Adding a persisted domain

1. Add a Dexie table in a new `version(N).stores({...})` block. Do not edit existing blocks.
2. Update persistence state collection and saving in `src/persistence/sync/sync.ts`: `IPersistedState`, `currentState`, `savedState`, `stateDiff`, `saveDiff` (including its empty-diff early return and transaction writes), and the `startPersistence` watch.
3. Update hydration in `sync.ts`: `hydrateStores`, `hydrateFromDatabase` and `hydrateLegacy` (with an appropriate fallback, currently an empty array for projects).
4. Update `db.spec.ts` (expected table list and a v1-to-vN upgrade test preserving existing data) and include the new table in the read transaction in `sync.spec.ts`'s `advanceAutosave` test helper.
5. Backup and legacy support are separate: add backup handling through `IBackupPayload`, `makeBackupPayload`, `exportData` and `applyImportedData`; add a legacy key and migration behavior only if legacy support is required. `projects` currently have neither legacy persistence nor backup support.
