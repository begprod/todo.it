<template>
  <BaseLayoutDefault />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const { isContextMenuOpen } = storeToRefs(commonStore);
const { getIsCurrentWeekIsLast } = storeToRefs(calendarStore);
const {
  tasks,
  setMonths,
  setNextMonth,
  setCurrentEditingTask,
  createTasksByDayStructure,
  checkAndCleanupTasksByDayStructure,
} = calendarStore;

onBeforeMount(() => {
  setMonths();

  if (Object.keys(tasks).length === 0) {
    createTasksByDayStructure();
  }

  if (getIsCurrentWeekIsLast.value) {
    setNextMonth();
    createTasksByDayStructure();
  }

  checkAndCleanupTasksByDayStructure();
});

watch(isContextMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    setCurrentEditingTask(null);
  }
});
</script>
