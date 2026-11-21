<template>
  <div class="settings">
    <BaseSidebar>
      <template #nav>
        <BaseNavigation :items="settingsNavItems" :active-name="activeName" />
      </template>
    </BaseSidebar>

    <div class="setting__panel">
      <div class="setting__header">
        <h1 class="setting__title">{{ pageTitle }}</h1>
        <div id="settings-actions" class="setting__actions"></div>
      </div>
      <div class="setting__content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import { buildNavigationItems } from '@/helpers';
import { settingsRoutes } from '@/router';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';

const route = useRoute();

const settingsNavItems = buildNavigationItems(settingsRoutes, '/settings');
const activeName = computed(() => String(route.name ?? ''));
const pageTitle = computed(() => route.meta.pageTitle ?? '');
</script>

<style scoped>
.settings {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.setting__panel {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-self: flex-start;
  min-height: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.setting__header {
  display: grid;
  grid-template-columns: auto 3.125rem;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  position: sticky;
  top: -1rem;
  z-index: 10;
  padding: 1.5rem 0;
  background-color: var(--color-bg-surface);
}

.setting__title {
  margin: 0;
  font-size: var(--typo-size-2xl);
  font-weight: 600;
  line-height: 1.5;
}

.setting__content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
</style>
