<template>
  <div class="grid gap-5 mt-5">
    <BaseTask
      v-for="task in calendarStore.getBacklogTasks"
      :key="task.id"
      :task="task"
    />
  </div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import BaseTask from '@/components/ui/BaseTask.vue';

const calendarStore = useCalendarStore();
</script>
