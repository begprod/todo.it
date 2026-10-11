<template>
  <nav class="navigation" aria-label="Main">
    <RouterLink
      v-for="item in menuItems"
      :key="item.name"
      :to="item.path"
      class="navigation__link"
      :data-test-id="`nav-link-${item.name}`"
    >
      <component v-if="item.icon" :is="item.icon" class="icon icon_md" />

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
    .map((route) => ({
      name: String(route.name),
      path: route.path,
      title: route.meta.title,
      icon: route.meta.icon,
    })),
);
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navigation__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--color-typo-ghost);
  font-size: var(--typo-size-lg);
  text-decoration: none;
  border-radius: var(--rounded-lg);
  transition: 0.3s ease-in-out;
  transition-property: color, background-color;
}

.navigation__link.router-link-exact-active {
  color: var(--color-typo-link);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 10px 10px 0px;
  background-color: var(--color-bg-surface-trinary);
}
</style>
