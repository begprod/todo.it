<template>
  <BaseSurface>
    <h1>{{ calendarStore.getCurrentMonth.name }}</h1>
    <div
      v-for="week in calendarStore.getCurrentMonth.weeks"
      :key="week.id"
    >
      <h2>{{ week.daysInterval.start }} - {{ week.daysInterval.end }}</h2>

      <div
        v-for="day in week.days"
        :key="day.id"
      >
        <h4>{{ day.name }}</h4>

        <div
          v-for="todo in day.todos"
          :key="todo.id"
        >
          todo
          {{ todo.title }}
        </div>
      </div>
    </div>
  </BaseSurface>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from './BaseSurface.vue';

const calendarStore = useCalendarStore();

onMounted(() => {
  // const currentMonth = format(new Date(), 'MMMM');

  // if (calendarStore.getCurrentDateMonth !== currentMonth) {
    calendarStore.setCurrentMonth();
  // }
});
</script>
