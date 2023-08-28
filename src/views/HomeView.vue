<template>
  <BaseLayoutDefault>
    <template #sidebar>
      <BaseSidebar />
    </template>
    <template #content>
      <BaseWorkSpace />
    </template>
  </BaseLayoutDefault>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar.vue';
import BaseWorkSpace from '@/components/BaseWorkSpace.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const { isContextMenuOpen } = storeToRefs(commonStore);

onBeforeMount(() => {
  if (calendarStore.months.length === 0) {
    calendarStore.setMonths();
  }

  if (Object.keys(calendarStore.tasks).length === 0) {
    calendarStore.createTasksByDayStructure();
  }

  if (calendarStore.getIsCurrentWeekIsLast) {
    calendarStore.setNextMonth();
    calendarStore.createTasksByDayStructure();
  }

  calendarStore.checkAndCleanupTasksByDayStructure();
});

watch(isContextMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    calendarStore.setCurrentEditingTask(null);
  }
});
</script>
