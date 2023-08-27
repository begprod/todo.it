<template>
  <BaseHeader />

  <main class="container min-h-[calc(100vh-120px)] mx-auto p-5 lg:pb-10">
    <div class="flex flex-col lg:flex-row">
      <slot name="sidebar"></slot>
      <slot name="content"></slot>
    </div>
  </main>

  <BaseTaskContextMenu :current-editing-task="calendarStore.getCurrentEditingTask" />
  <BaseFooter />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseHeader from '@/components/layouts/partials/BaseHeader.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter.vue';
import BaseTaskContextMenu from '@/components/ui/BaseTaskContextMenu.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const { isContextMenuOpen } = storeToRefs(commonStore);

watch(isContextMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    calendarStore.setCurrentEditingTask(null);
  }
});
</script>
