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
import { useCalendarStore } from '@/stores';
import { onBeforeMount } from 'vue';
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar.vue';
import BaseWorkSpace from '@/components/BaseWorkSpace.vue';

const calendarStore = useCalendarStore();

onBeforeMount(() => {
  if (calendarStore.months.length === 0) {
    calendarStore.setMonths();
  }

  if (Object.keys(calendarStore.tasks).length === 0) {
    calendarStore.createTasksByDayStructure();
  }

  if (calendarStore.getIsCurrentWeekIsLast) {
    calendarStore.setNextMonth();
  }

  calendarStore.checkAndCleanupTasksByDayStructure();
});
</script>
