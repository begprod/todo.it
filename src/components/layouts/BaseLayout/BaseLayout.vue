<template>
  <main class="layout">
    <div class="layout__sidebar">
      <BaseSidebar>
        <template #logo>
          <BaseLogo />
        </template>
        <template #nav>
          <BaseNavigation :items="appNavItems" :active-name="activeName" />
        </template>
        <template #footer>
          <BaseFooter />
        </template>
      </BaseSidebar>
    </div>

    <div class="layout__inner">
      <slot />
    </div>
  </main>

  <BaseTaskActionsMenu />
  <BaseLabelActionsMenu />
  <BaseTaskLabelMenu />
  <BaseToast :type="status" :message="message" :is-visible="isToastVisible" @click="closeToast" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useCommonStore } from '@/stores';
import { routes } from '@/router';
import { buildNavigationItems } from '@/helpers';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';

const commonStore = useCommonStore();

const { status, message, isToastVisible } = storeToRefs(commonStore);
const { closeToast } = commonStore;

const route = useRoute();
const appNavItems = buildNavigationItems(routes);
const activeName = computed(() => String(route.matched[0]?.name ?? ''));
</script>

<style scoped>
.layout {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  height: 100dvh;
  /* background-color: var(--color-bg-surface-trinary); */
  background-image: radial-gradient(
    circle 476px at 54.8% 51.5%,
    rgba(168, 229, 253, 1) 0%,
    rgba(244, 244, 254, 1) 42.3%,
    rgba(244, 244, 254, 1) 100.2%
  );
}

.layout__sidebar {
  flex-shrink: 0;
  flex-grow: 0;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-lg);
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}

.layout__inner {
  display: flex;
  flex-grow: 1;
  padding: 1rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-lg);
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
