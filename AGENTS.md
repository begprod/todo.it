# AGENTS.md

## Overview

`todo.it` is a client-only Vue 3 + TypeScript SPA (Vite, Pinia, vue-router). There is **no backend/API** — user data is persisted in IndexedDB via Dexie, UI settings stay in `localStorage`. Built and deployed to GitHub Pages under the `/todo.it/` subpath.

## Commands

Node >= 22 (`.nvmrc` is `22`).

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build` — runs `vue-tsc --noEmit` (root `tsconfig.json`) **then** `vite build`
- Typecheck: `npm run type:check` — uses a *different* config (`vue-tsc -p tsconfig.vitest.json`); `build` already typechecks, so this is mainly for tests
- Test once: `npm run test:unit` (`vitest run`); watch: `npm run test:unit:watch`
- Single test file: `npm run test:unit -- src/stores/tasks/tasks.spec.ts`
- Lint: `npm run lint` — ESLint **with `--fix`**, it mutates files
- Format: `npm run prettier:check` / `npm run prettier:format` (scoped to `src/` only)
- Deploy (maintainer): `npm run deploy` — publishes `dist/` to gh-pages

There are no CI workflows. `prepare` runs husky but no hook scripts are present — do not rely on pre-commit checks.

## Architecture

- Entry: `src/main.ts` → `App.vue` (only `<RouterView/>`) → routes `/` (`HomeView`), `/projects` (`ProjectsView`), `/backlog` (`BacklogView`), `/settings` (`SettingsView`); unknown paths redirect to `/`.
- Bootstrap: `src/main.ts` awaits `initPersistence()` (opens Dexie, runs the one-time `localStorage` → IndexedDB migration, hydrates stores) **before** `app.mount`. Stores must never be created before that.
- `HomeView.vue` `onBeforeMount`: call **`initCalendar()` before `initTasksObject()`** (tasks are keyed by generated day ids). Both re-run on window focus if the calendar date changed.
- Persistence layer: `src/persistence/<module>/<module>.ts` + co-located spec (`db`, `serialize`, `migration`, `sync`, `backup`); public API is `src/persistence/index.ts`. Dependency direction is one-way: `main → persistence → stores`; stores and components do not import Dexie.
- Persisted domains: `tasks`, `scopes`, `labels`, `projects`. When adding a persisted domain, update all of: `IPersistedState`, `currentState`, `savedState`, `stateDiff`, `saveDiff` (early-return + transaction + `bulkPut`/`delete`), `startPersistence` watch, `hydrateStores`, `hydrateFromDatabase`, `hydrateLegacy` (empty array). Legacy (`localStorage`) and backup are separate opt-ins: a new domain is IndexedDB-only unless added to `LEGACY_KEYS` and the backup payload.
- Pinia stores: `src/stores/<name>/<name>.ts`, barrel-exported from `@/stores`. Specs are co-located, one per component/store.
- Global popups are mounted in `BaseLayout`, not in views. Visibility state lives in `usePopupsStore` (`isTaskActionMenuOpen`, `isTaskLabelMenuOpen`, `isLabelActionMenuOpen`, `isProjectFormOpen`); views only call `open...`/`close...`. `BaseProjectForm` is mounted in `BaseLayout` inside `BasePopup`.
- Calendar is generated, not persisted: `helpers/generateMonths` + `generateDays`. Day ids are `ddMMyyyy`, month ids `MMyyyy`; the tasks map is keyed by day id plus the literal `'backlog'`. Cleanup compares `day.substring(2)` to month ids.
- Helpers barrel: `@/helpers` (generateMonths, generateDays).
- UI uses `lucide-vue-next` icons, `vuedraggable` for drag'n'drop, `@vueuse/core` (`useLocalStorage` for settings, `watchThrottled`), markdown-it (+ task lists) for task descriptions; storage uses `dexie` (`src/persistence`).

## Conventions

- SFC only, always `<script setup lang="ts">`; block order is `<template>` → `<script setup>` → `<style scoped>`. Options API is not used.
- Components are one-per-directory in PascalCase (`BaseTask/BaseTask.vue`) with the spec beside it (`.spec.ts`). Shared primitives live under `src/components/ui/` (form controls under `ui/controls/`); feature components sit directly under `src/components/`; UI component names use the `Base` prefix.
- TypeScript: interfaces are `I`-prefixed (`ITask`, `IProps`); type-only imports use a separate `import type { … }` statement (never inline `{ type X }`); **all project imports use the `@/` alias** — no `./` or `../` for project code, including same-folder and spec files (`@/persistence/db/db`, `@/persistence/migration/backup.fixture`).
- Pinia stores use the Options API (`state/getters/actions`) and are re-exported from `@/stores`. `tasks`, `scopes`, `labels` and `projects` are hydrated/saved by `src/persistence`; only `common` settings (`currentViewType`, `lastUpdateDate`) still use `@vueuse/core` `useLocalStorage`.
- CSS: each SFC has `<style scoped>`; class names are BEM-ish and derived from the component name (`.button`, `.button__icon-right`, `.button_variant_action`); values come from custom properties defined in `src/assets/css` (`--color-*`, `--typo-*`, `--rounded-*`); use `rem`, not `px`.
- Routes are kebab-case; pages are `src/views/*View.vue` (`HomeView`, `ProjectsView`, `BacklogView`, `SettingsView`).

## Code style

- Braces are mandatory for every control-flow body (`if` / `else` / `for` / `while`), even for a single statement. No one-line bodies.
- Every `if` / `for` / `while` / `try` block is separated from the surrounding **statements** by blank lines above and below. A blank line is not required when the block is the first or last statement of a function body (Prettier removes it).
- Separate logical blocks with one blank line; keep statements that form one step together. Do not mix unrelated operations in one block. A declaration that creates a dependency for the following setup block (`const pinia = createTestingPinia(...)`, `const db = new TodoDatabase(...)`) is its own block: put a blank line after it.
- Group `await` statements together: do not separate them with blank lines. Blank lines are only between logical blocks, after the whole async group.
- Prefer guard clauses and early returns over nesting; no `else` after `return` / `throw`.
- One statement per line; no nested ternaries; no assignments inside conditions.
- Exported functions use `function` declarations; local helpers use `const fn = () => …`.
- Imports form one continuous block: no blank lines between import statements, including between external packages and `@/` imports. Type-only imports use a separate `import type` statement; all project imports use the `@/` alias.
- No `any`, `@ts-ignore`, `eslint-disable`, `console`, or commented-out code. Cast to a concrete type and explain non-obvious casts.
- Comments explain *why*, not *what*; do not narrate obvious code.
- One module — one responsibility. If a file grows past ~200 lines or mixes storage, parsing and UI, split it.

## Gotchas

- Persistence keys are **inconsistent**: `todo.it:tasks`, `todo:scopes`, `todo:labels`. They are the source for the one-time migration and the backup format (`backup_example.json`); renaming any of them breaks migration and old backups. UI settings use `todo.it:currentViewType` / `todo.it:lastUpdateDate`.
- IndexedDB database is `todo.it` with stores `tasks` (`dayId`), `scopes` (`id`), `labels` (`id`), `projects` (`id`) and service `meta` (`key`). Do not rename stores or change key paths without a Dexie schema version bump.
- Add a new table with a new `version(N).stores({...})` block; never edit an existing version block. Update the expected table list in `db.spec.ts` and add a v1→vN upgrade test (open a v1 Dexie DB with data, then open `TodoDatabase` and assert data + new table). Also add the table to the read transaction in `sync.spec.ts`'s `advanceAutosave`.
- `projects` are IndexedDB-only: they are not included in backup export/import and have no legacy `localStorage` key. If legacy/backup parity is required, add a new legacy key and update migration/backup.
- `meta` keeps the migration marker (`migration.localStorage`) and the raw pre-migration copy (`backup.preMigration`). After a successful migration the three data keys are removed from `localStorage`; `backup.preMigration` is never deleted.
- `vite.config.ts` sets `base: '/todo.it/'` — route and asset URLs must respect the GitHub Pages subpath.
- PWA plugin has `devOptions.enabled: false`; the service worker is not active during `npm run dev`.
- ESLint errors (not warnings): single quotes, semicolons, `no-console`, `no-debugger`. Prettier: singleQuote, semi, trailingComma `all`, printWidth 100.
- TypeScript is `strict` with `noUnusedLocals` / `noUnusedParameters`.

## Testing

- Vitest + jsdom; no e2e. Specs are co-located (`Foo.spec.ts` next to `Foo.vue`). `tsconfig.app.json` excludes `src/**/__tests__/*`, so tests must sit beside the source.
- IndexedDB is not implemented by jsdom: `vitest.setup.ts` loads `fake-indexeddb/auto`. Each spec creates a uniquely named `TodoDatabase` and closes/deletes it in `afterEach`.
- Autosave tests use `vi.useFakeTimers()` + `await vi.advanceTimersByTimeAsync(300)`; do not call `flush()` manually to emulate the watcher/debounce path.
- **Two Pinia patterns — do not mix**: store specs (`src/stores/**`) use a real `createPinia()` + `setActivePinia()` + `storeToRefs`; component/view specs use `createTestingPinia({ createSpy: vi.fn })` from `@pinia/testing`.
- Component spec setup with a testing pinia: create the pinia, then a blank line, then `setActivePinia(pinia)` and any store state setup, then a blank line, then `mount`:
  ```ts
  const pinia = createTestingPinia({ createSpy: vi.fn });

  setActivePinia(pinia);
  useSomeStore().someState = value;

  wrapper = mount(Component, { global: { plugins: [pinia] } });
  ```
- Component spec shape: `let wrapper: ComponentWrapperType<typeof Component>` (type from `@/types`), a local `createComponent()` that calls `mount`, `beforeEach(createComponent)`, `afterEach(() => wrapper.unmount())`; test names are `it('should …')`.
- Do not create `src/views/*.spec.ts`. Test components, stores, and persistence instead. For popup wiring, test the component/store, not the view.
- Select DOM via `data-test-id="…"` attributes (used across components) or CSS classes; `wrapper.setProps()` for prop changes.
