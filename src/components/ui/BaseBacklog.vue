<template>
  <div class="grid gap-5">
    <BaseSurface
      v-for="task in calendarStore.getBacklogTasks"
      :key="task.id"
    >
      <h2>{{ task.title }}</h2>
      <p>{{ task.description }}</p>
    </BaseSurface>
  </div>
</template>

<script setup lang="ts">
import BaseSurface from './BaseSurface.vue';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
</script>
