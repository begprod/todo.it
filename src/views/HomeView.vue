<template>
  <BaseLayout />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useCalendarStore, useTasksStore } from '@/stores';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const tasksStore = useTasksStore();
const { lastCalendarUpdateDate, isActionMenuOpen } = storeToRefs(commonStore);
const { setLastUpdateDate, setCurrentEditingTask } = commonStore;
const { initCalendar } = calendarStore;
const { initTasksObject } = tasksStore;

onBeforeMount(() => {
  const updateDate = new Date().toLocaleDateString();

  setLastUpdateDate(updateDate);
  initCalendar();
  initTasksObject();

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
    initCalendar();
    initTasksObject();
  }
};
</script>
@/helpers/generateMonths
