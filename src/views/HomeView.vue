<template>
  <BaseLayout />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseLayout from '@/components/layouts/BaseLayout.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const { isActionMenuOpen } = storeToRefs(commonStore);

const {
  tasks,
  setCurrentEditingTask,
  createMonthList,
  createTasksByDayStructure,
  checkAndCleanupTasksByDayStructure,
} = calendarStore;

onBeforeMount(() => {
  createMonthList();

  if (!Object.keys(tasks).length) {
    createTasksByDayStructure();
  }

  checkAndCleanupTasksByDayStructure();
});

watch(isActionMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    setCurrentEditingTask(null);
  }
});
</script>
@/helpers/generateMonths
