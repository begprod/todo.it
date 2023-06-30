<template>
  <h1>{{ currentMonth }}</h1>
  <div
    v-for="(item, index) in calendarStore.getCurrentMonth"
    :key="index"
  >
    {{ item }}
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { format } from 'date-fns';
// import { getMonthWeekDays } from '@/helpers';

const calendarStore = useCalendarStore();

onMounted(() => {
  calendarStore.setCurrentMonth();
});

const currentMonth = format(new Date(), 'MMMM');

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
