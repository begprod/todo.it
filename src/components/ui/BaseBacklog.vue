<template>
  <div class="container mx-auto my-10 p-10 bg-gray-300 rounded-lg shadow-md">
    <div
      v-for="todo in calendarStore.allTodos"
      :key="todo.id"
    >
      {{ todo.title }}
      {{ todo.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();
</script>
