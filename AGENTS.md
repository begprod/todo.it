# AGENTS.md

## Overview

`todo.it` is a client-only Vue 3 + TypeScript SPA (Vite, Pinia, vue-router). There is **no backend/API** — all state is persisted in browser `localStorage`. Built and deployed to GitHub Pages under the `/todo.it/` subpath.

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

- Entry: `src/main.ts` → `App.vue` (only `<RouterView/>`) → routes `/` (`HomeView`) and `/backlog` (`BacklogView`); unknown paths redirect to `/`.
- Bootstrap lives in `HomeView.vue` `onBeforeMount`: call **`initCalendar()` before `initTasksObject()`** (tasks are keyed by generated day ids). Both re-run on window focus if the calendar date changed.
- Pinia stores: `src/stores/<name>/<name>.ts`, barrel-exported from `@/stores`. Specs are co-located, one per component/store.
- Calendar is generated, not persisted: `helpers/generateMonths` + `generateDays`. Day ids are `ddMMyyyy`, month ids `MMyyyy`; the tasks map is keyed by day id plus the literal `'backlog'`. Cleanup compares `day.substring(2)` to month ids.
- Helpers barrel: `@/helpers` (generateMonths, generateDays, import/export localStorage).
- UI uses `lucide-vue-next` icons, `vuedraggable` for drag'n'drop, `@vueuse/core` (`useLocalStorage`, `watchThrottled`), markdown-it (+ task lists) for task descriptions.

## Conventions

- SFC only, always `<script setup lang="ts">`; block order is `<template>` → `<script setup>` → `<style scoped>`. Options API is not used.
- Components are one-per-directory in PascalCase (`BaseTask/BaseTask.vue`) with the spec beside it (`.spec.ts`). Shared primitives live under `src/components/ui/` (form controls under `ui/controls/`); feature components sit directly under `src/components/`; UI component names use the `Base` prefix.
- TypeScript: interfaces are `I`-prefixed (`ITask`, `IProps`); type-only imports use a separate `import type { … }` statement; import project code via the `@/` alias to `src/`.
- Pinia stores use the Options API (`state/getters/actions`) and persist through `@vueuse/core` `useLocalStorage`; all stores are re-exported from `@/stores`.
- CSS: each SFC has `<style scoped>`; class names are BEM-ish and derived from the component name (`.button`, `.button__icon-right`, `.button_variant_action`); values come from custom properties defined in `src/assets/css` (`--color-*`, `--typo-*`, `--rounded-*`); use `rem`, not `px`.
- Routes are kebab-case; pages are `src/views/*View.vue` (`HomeView`, `BacklogView`).

## Gotchas

- Persistence keys are **inconsistent**: tasks/common use the `todo.it:` prefix (`todo.it:tasks`, `todo.it:currentViewType`, `todo.it:lastUpdateDate`, …) but labels use `todo:scopes` / `todo:labels`. Match the existing key exactly or import/export breaks.
- `importDataToLocalStorage` writes every top-level JSON key straight into `localStorage`; export/import round-trip depends on those raw keys.
- `vite.config.ts` sets `base: '/todo.it/'` — route and asset URLs must respect the GitHub Pages subpath.
- PWA plugin has `devOptions.enabled: false`; the service worker is not active during `npm run dev`.
- ESLint errors (not warnings): single quotes, semicolons, `no-console`, `no-debugger`. Prettier: singleQuote, semi, trailingComma `all`, printWidth 100.
- TypeScript is `strict` with `noUnusedLocals` / `noUnusedParameters`.

## Testing

- Vitest + jsdom; no e2e. Specs are co-located (`Foo.spec.ts` next to `Foo.vue`). `tsconfig.app.json` excludes `src/**/__tests__/*`, so tests must sit beside the source.
- **Two Pinia patterns — do not mix**: store specs (`src/stores/**`) use a real `createPinia()` + `setActivePinia()` + `storeToRefs`; component/view specs use `createTestingPinia({ createSpy: vi.fn })` from `@pinia/testing`.
- Component spec shape: `let wrapper: ComponentWrapperType<typeof Component>` (type from `@/types`), a local `createComponent()` that calls `mount`, `beforeEach(createComponent)`, `afterEach(() => wrapper.unmount())`; test names are `it('should …')`.
- Select DOM via `data-test-id="…"` attributes (used across components) or CSS classes; `wrapper.setProps()` for prop changes.
