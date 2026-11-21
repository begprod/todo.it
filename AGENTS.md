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

There are no CI workflows; Git hooks are the only gate. Husky `pre-commit` runs `prettier:check` → `type:check` → `lint` (lint auto-fixes, so it is last), `pre-push` runs `test:unit`. Run the same sequence locally in that order.

## Architecture

- Entry: `src/main.ts` → `App.vue` (only `<RouterView/>`) → routes `/` (`HomeView`), `/projects` (`ProjectsView`), `/backlog` (`BacklogView`), `/settings` (`SettingsView`); unknown paths redirect to `/`.
- Bootstrap: `src/main.ts` awaits `initPersistence()` (opens Dexie, runs the one-time `localStorage` → IndexedDB migration, hydrates stores) **before** `app.mount`. Stores must never be created before that.
- Persistence lives in `src/persistence/`; its public API is `src/persistence/index.ts` and dependencies flow `main → persistence → stores` (stores/components do not import Dexie). See [`docs/persistence.md`](docs/persistence.md).
- Pinia stores: `src/stores/<name>/<name>.ts`, barrel-exported from `@/stores`. Specs are co-located, one per component/store.
- Global popups are mounted in `BaseLayout`, not in views. Visibility state lives in `usePopupsStore` (`isTaskActionMenuOpen`, `isTaskLabelMenuOpen`, `isLabelActionMenuOpen`, `isProjectFormOpen`, `isProjectEditFormOpen`, `isScopeFormOpen`, `isLabelFormOpen`); pages/partials only call `open...`/`close...`. `BaseProjectForm`, `BaseProjectEditForm`, `BaseScopeForm`, and `BaseLabelForm` are mounted in `BaseLayout` inside `BasePopup`.
- Calendar initialization and generated ids are documented in [`docs/calendar-generation.md`](docs/calendar-generation.md).
- UI uses `lucide-vue-next` icons, `vuedraggable` for drag'n'drop, `@vueuse/core` (`useLocalStorage` for settings, `watchThrottled`), markdown-it (+ task lists) for task descriptions; storage uses `dexie` (`src/persistence`).

## Conventions

- SFC only, always `<script setup lang="ts">`; block order is `<template>` → `<script setup>` → `<style scoped>`. Options API is not used.
- `defineEmits`: the array form (`defineEmits(['click'])`) is only for events without a payload. Any event that carries data — including `update:modelValue` — uses the typed form `defineEmits<{ select: [item: IMenuItem] }>()`.
- `defineSlots` is not used yet. When a slot with props appears, type it as `defineSlots<{ 'slot-name': (props: IProps) => VNode[] }>()` (`VNode` is a type-only import from `vue`); slots without props need no typing.
- Preferred order inside `<script setup>` (after imports): `interface IProps` → `defineProps`/`withDefaults` → `defineEmits` → `defineSlots` → stores → `ref` → `computed` → `watch` → functions → lifecycle hooks, with `defineExpose` last. Apply it to new and edited components; existing deviations are not a refactor target.
- Preferred attribute order in templates: `v-if`/`v-show` → `v-for` → `id` → `ref`/`key` → `v-model` → `v-bind`/`:` → static attributes (`class`, `title`, `placeholder`, `type`) → `@events`. `vue/attributes-order` is not enabled, so this is manual and applies to new and edited templates.
- Components are one-per-directory in PascalCase (`BaseTask/BaseTask.vue`) with the spec beside it (`.spec.ts`). Shared primitives live under `src/components/ui/` (form controls under `ui/controls/`); feature components sit directly under `src/components/`; UI component names use the `Base` prefix. Grouping folders inside `src/components/` are kebab-case or a single lowercase word (`layouts/partials`, `ui/controls`); component directories inside stay PascalCase, one component per directory.
- Do not introduce new `data-test-id` attributes; they are legacy. Use CSS classes or ids for test selectors.
- TypeScript: interfaces are `I`-prefixed (`ITask`, `IProps`); type-only imports use a separate `import type { … }` statement (never inline `{ type X }`); **all project imports use the `@/` alias** — no `./` or `../` for project code, including same-folder and spec files (`@/persistence/db/db`, `@/persistence/migration/backup.fixture`).
- Arrays use the bracket syntax: `ITask[]`, `RouteRecordRaw[]`, including nested generics (`Record<string, ITask[]>`). `Array<T>` is accepted legacy, not a style to copy; convert it safely when you touch the file.
- Pinia stores use the Options API (`state/getters/actions`) and are re-exported from `@/stores`. `tasks`, `scopes`, `labels` and `projects` are hydrated/saved by `src/persistence`; only `common` settings (`currentViewType`, `lastUpdateDate`) still use `@vueuse/core` `useLocalStorage`.
- Destructure Pinia state through `storeToRefs`; actions are destructured directly (`const { updateTask } = tasksStore`).
- CSS: each SFC has `<style scoped>`; class names are BEM-ish and derived from the component name (`.button`, `.button__icon-right`, `.button_variant_action`); values come from custom properties defined in `src/assets/css` (`--color-*`, `--typo-*`, `--rounded-*`); use `rem`, not `px`.
- Routes are kebab-case; pages are `src/views/*View.vue` (`HomeView`, `ProjectsView`, `BacklogView`, `SettingsView`).

## Code style

- Braces are mandatory for every control-flow body (`if` / `else` / `for` / `while`), even for a single statement. No one-line bodies.
- Every `if` / `for` / `while` / `try` block is separated from the surrounding **statements** by blank lines above and below. A blank line is not required when the block is the first or last statement of a function body (Prettier removes it).
- A block of variable declarations is its own logical block; separate it with a blank line from preceding and following statements. Do not attach statements to a declaration block (for example, `const unknownProject = …;` immediately followed by `store.createProject(…)` is incorrect). A declaration that creates a dependency for the following setup block (`const pinia = createTestingPinia(...)`, `const db = new TodoDatabase(...)`) remains its own block: put a blank line after it.
- Group `await` statements together: do not separate them with blank lines. Blank lines are only between logical blocks, after the whole async group.
- Prefer guard clauses and early returns over nesting; no `else` after `return` / `throw`.
- One statement per line; no nested ternaries; no assignments inside conditions.
- Functions are arrow function expressions, exported ones included (`export const generateDays = (…) => …`). A `function` declaration is allowed only where an arrow cannot be used: a declaration that must be hoisted (called before its definition), a top-level export that must survive circular imports without TDZ, `arguments`, a generator, or a constructor. When you touch a file, convert `function` declarations that are safe to convert; do not mass-refactor unrelated files.
- Imports form one continuous block: no blank lines between import statements, including between groups. Order inside the block: `import type` statements first, then external packages, then `@/` imports; no alphabetical sorting is required. All project code uses the `@/` alias.
- No `any`, `@ts-ignore`, `eslint-disable`, `console`, or commented-out code. Cast to a concrete type and explain non-obvious casts.
- Comments explain *why*, not *what*; do not narrate obvious code.
- One module — one responsibility. If a file grows past ~200 lines or mixes storage, parsing and UI, split it.

## Gotchas

- Do not rename legacy data keys `todo.it:tasks`, `todo:scopes`, or `todo:labels`, or edit an existing Dexie schema version; add tables only in a new `version(N).stores({...})` block. See [`docs/persistence.md`](docs/persistence.md).
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
- Slots can only be passed at mount time, so slot scenarios call `mount` inside `it()` (`wrapper.setSlots()` does not exist).
- `describe` is PascalCase (`describe('BaseInput')`); existing lowercase names are not a refactor target. Repeated scenarios go through `it.each` rather than a new local helper.
- In component specs, use `await nextTick()` imported from `vue` instead of `await wrapper.vm.$nextTick()`; when editing a spec that still calls `$nextTick`, replace it.
- No extra `nextTick` after VTU helpers (`setProps`, `trigger`, `setValue`) — they already wait for the DOM. `nextTick` is needed only when state changes outside those helpers: direct `ref`/store mutation, calling a component method, timers.
- Await promises and async actions with `await flushPromises()` from `@vue/test-utils`, not `nextTick`.
- Do not create `src/views/*.spec.ts`. Test components, stores, and persistence instead. For popup wiring, test the component/store, not the view.
- Do not add new `data-test-id` attributes; use CSS classes, ids, or component wrappers for selectors. Existing `data-test-id` attributes in untouched code may remain. Use `wrapper.setProps()` for prop changes.
- `v-model`: assert the `modelValue` prop and the `update:modelValue` emit via `wrapper.emitted()`.

## Documentation

- Extra context lives in `docs/` (`docs/persistence.md`, `docs/calendar-generation.md`). When a feature changes, update the matching document in the same change so it does not drift.
- Every new or substantially rewritten document starts with frontmatter:

  ```markdown
  ---
  description: One line about what the document covers.
  tags: [persistence, dexie]
  ---
  ```

- Authorship is marked in the body: no marker — written by a human; `> Author: AI` — generated by AI; `> Author: <name> + AI` — human and AI together.
- Do not reformat existing documents wholesale; add frontmatter and the authorship marker when you edit the file's content.
- `AGENTS.md` documents stable, project-wide architecture and conventions only. Feature implementation details and mechanics between specific components belong in `docs/`, and only when the decision is non-obvious or easy to forget — do not grow this file with them.
- Keep this file current too: when architecture or conventions change, update `AGENTS.md`.
