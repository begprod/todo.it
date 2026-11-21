---
description: Calendar generation, task day keys, and initialization behavior.
tags: [calendar, tasks]
---

# Calendar

> Author: AI

The calendar is generated at runtime and is not persisted. `generateMonths` and `generateDays` are in `src/helpers/generateMonths/generateMonths.ts` and `src/helpers/generateDays/generateDays.ts`; both are exported by `src/helpers/index.ts`.

`generateMonths` uses month ids formatted as `MMyyyy`; `generateDays` uses day ids formatted as `ddMMyyyy`. In `src/stores/calendar/calendar.ts`, `initCalendar()` starts with `generateMonths(5)`. If `shouldGenerateNextMonth` is true, it also prepends the result of `generateMonths(0, 1)` and its days. The flag is set when the current numeric `ddMMyyyy` id is greater than the id at `daysList[daysList.length - 15]`.

Tasks are keyed by day id in `src/stores/tasks/tasks.ts`, with the literal `'backlog'` as the backlog key. `initTasksObject()` creates missing entries for generated days and backlog, then removes obsolete day entries by comparing `day.substring(2)` against the current month ids; backlog is retained.

`src/views/HomeView.vue` calls `initCalendar()` before `initTasksObject()` in `onBeforeMount`. Its window-focus handler repeats both calls in that order when the locale-formatted calendar date has changed.
