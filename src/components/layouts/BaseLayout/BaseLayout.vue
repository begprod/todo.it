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
      <div v-if="slots.title" class="layout__title">
        <slot name="title" />
      </div>

      <slot />
    </div>
  </main>

  <BaseTaskActionsMenu />
  <BaseLabelActionsMenu />
  <BaseTaskLabelMenu />
  <BaseProjectForm />
  <BaseProjectEditForm />
  <BaseScopeForm />
  <BaseLabelForm />
  <BaseToast :type="status" :message="message" :is-visible="isToastVisible" @click="closeToast" />
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
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
import BaseProjectForm from '@/components/BaseProjectForm/BaseProjectForm.vue';
import BaseProjectEditForm from '@/components/BaseProjectEditForm/BaseProjectEditForm.vue';
import BaseScopeForm from '@/components/BaseScopeForm/BaseScopeForm.vue';
import BaseLabelForm from '@/components/BaseLabelForm/BaseLabelForm.vue';

const slots = useSlots();

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
  background-image: var(--color-bg-gradient);
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-lg);
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}

.layout__title {
  display: grid;
  grid-template-columns: auto 50px;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}
</style>
