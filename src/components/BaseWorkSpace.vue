<template>
  <BaseSurface>
    <!-- <BaseMonth
      :name="calendarStore.getCurrentMonth.name"
      :weeks="calendarStore.getCurrentMonth.weeks"
    /> -->
    <BaseMonth
      v-for="month in calendarStore.getMonths"
      :key="month.name"
      :name="month.name"
      :weeks="month.weeks"
    />
  </BaseSurface>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from '@/components/ui/BaseSurface.vue';
import BaseMonth from '@/components/ui/BaseMonth.vue';

const calendarStore = useCalendarStore();

onBeforeMount(() => {
  // const currentMonth = format(new Date(), 'MMMM');

  // if (calendarStore.getCurrentDateMonth !== currentMonth) {
    console.log('onBeforeMount');
    calendarStore.setMonths();
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
