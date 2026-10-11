<template>
  <main class="layout">
    <div class="layout__sidebar">
      <BaseSidebar />
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
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

const commonStore = useCommonStore();

const { status, message, isToastVisible } = storeToRefs(commonStore);
const { closeToast } = commonStore;
</script>

<style scoped>
.layout {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  height: 100dvh;
  background-color: var(--color-bg-surface-trinary);
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
