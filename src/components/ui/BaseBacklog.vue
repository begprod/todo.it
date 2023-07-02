<template>
  <div class="grid gap-5">
    <BaseSurface
      v-for="todo in calendarStore.allTodos"
      :key="todo.id"
    >
      <h2>{{ todo.title }}</h2>
      <p>{{ todo.description }}</p>
    </BaseSurface>
  </div>
</template>

<script setup lang="ts">
import BaseSurface from './BaseSurface.vue';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
</script>
