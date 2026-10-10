<template>
  <nav class="navigation" aria-label="Main">
    <RouterLink
      v-for="item in menuItems"
      :key="item.name"
      :to="item.path"
      class="navigation__link"
      :data-test-id="`nav-link-${item.name}`"
    >
      {{ item.title }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import type { RouteMeta, RouteRecordRaw } from 'vue-router';
import type { IMenuItem } from '@/types';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { routes } from '@/router';

const menuItems = computed<IMenuItem[]>(() =>
  routes
    .filter(
      (route): route is RouteRecordRaw & { meta: RouteMeta } =>
        route.meta !== undefined && !route.meta.isHidden,
    )
    .map((route) => ({ name: String(route.name), path: route.path, title: route.meta.title })),
);
</script>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navigation__link {
  color: var(--color-typo-ghost);
  font-size: var(--typo-size-sm);
  text-decoration: none;
  border-radius: var(--rounded-xs);
  box-shadow: 0px 0px 0px 0px var(--color-bg-border);
  transition: 0.2s ease-in-out;
  transition-property: color, background-color;
}

.navigation__link.router-link-active {
  color: var(--color-typo-primary);
}

.navigation__link.router-link-exact-active {
  color: var(--color-typo-link);
}
</style>
