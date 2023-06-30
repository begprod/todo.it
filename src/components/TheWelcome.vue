<template>
  <div class="container">
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
          {{ todo.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();

onMounted(() => {
  // const currentMonth = format(new Date(), 'MMMM');

  // if (calendarStore.getCurrentDateMonth !== currentMonth) {
    calendarStore.setCurrentMonth();
  // }
});

// const currentDate = new Date();
// const startMonth = startOfMonth(currentDate);
// const endMonth = endOfMonth(currentDate);
//
// const currentMonthWeekDays = getMonthWeekDays(currentDate, startMonth, endMonth);
//
// console.log(currentMonthWeekDays);
//
// const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
// const previousMonthStart = startOfMonth(previousMonth);
// const previousMonthEnd = endOfMonth(previousMonth);
//
// const previousMonthWeekDays = getMonthWeekDays(previousMonth, previousMonthStart, previousMonthEnd);
//
// console.log(previousMonthWeekDays);
//
// const previousPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
// const previousPreviousMonthStart = startOfMonth(previousPreviousMonth);
// const previousPreviousMonthEnd = endOfMonth(previousPreviousMonth);
//
// const previousPreviousMonthWeekDays = getMonthWeekDays(previousPreviousMonth, previousPreviousMonthStart, previousPreviousMonthEnd);
//
// console.log(previousPreviousMonthWeekDays);
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 20px;
  max-width: 1024px;
  font-family: sans-serif;
  background-color: lightgray;
  border-radius: 15px;
}
</style>
