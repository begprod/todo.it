<template>
  <BaseLayout />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseLayout from '@/components/layouts/BaseLayout.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { lastCalendarUpdateDate, isActionMenuOpen } = storeToRefs(commonStore);
const { setLastUpdateDate } = commonStore;
const { setCurrentEditingTask, initCalendarAndTasksObjects } = tasksStore;

onBeforeMount(() => {
  const updateDate = new Date().toLocaleDateString();

  setLastUpdateDate(updateDate);
  initCalendarAndTasksObjects();

  window.addEventListener('focus', tabFocusHandler);
});

watch(isActionMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    setCurrentEditingTask(null);
  }
});

watch(lastCalendarUpdateDate, (newValue: string) => {
  setLastUpdateDate(newValue);
});

const tabFocusHandler = () => {
  if (!lastCalendarUpdateDate.value) {
    return;
  }

  const currentDate = new Date().toLocaleDateString();

  if (currentDate !== lastCalendarUpdateDate.value) {
    setLastUpdateDate(currentDate);
    initCalendarAndTasksObjects();
  }
};
</script>
@/helpers/generateMonths
