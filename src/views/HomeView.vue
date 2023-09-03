<template>
  <BaseLayout />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount } from 'vue';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseLayout from '@/components/layouts/BaseLayout.vue';

const commonStore = useCommonStore();
const calendarStore = useTasksStore();
const { isActionMenuOpen } = storeToRefs(commonStore);
const { setCurrentEditingTask, initCalendarAndTasksData } = calendarStore;

onBeforeMount(() => {
  initCalendarAndTasksData();
});

watch(isActionMenuOpen, (newValue: boolean) => {
  if (!newValue) {
    setCurrentEditingTask(null);
  }
});
</script>
@/helpers/generateMonths
