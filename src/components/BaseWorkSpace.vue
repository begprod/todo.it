<template>
  <BaseSurface classes="grid gap-5">
    <BaseAccordion
      v-for="month in calendarStore.getMonths"
      :key="month.id"
      :title="month.name"
      :isOpen="true"
    >
      <BaseAccordion
        v-for="week in month.weeks"
        :key="week.id"
        :title="`${week.daysInterval.start} – ${week.daysInterval.end}`"
        :isOpen="true"
        title-classes="text-2xl"
      >
        <BaseAccordion
          v-for="day in week.days"
          :key="day.id"
          :title="day.name"
          :isOpen="true"
          title-classes="text-base"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa delectus doloribus hic incidunt natus necessitatibus, nemo nesciunt officia quaerat totam?
        </BaseAccordion>
      </BaseAccordion>
    </BaseAccordion>
  </BaseSurface>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from '@/components/ui/BaseSurface.vue';
import BaseAccordion from '@/components/ui/BaseAccordion.vue';

const calendarStore = useCalendarStore();

onBeforeMount(() => {
  // const currentMonth = format(new Date(), 'MMMM');

  // if (calendarStore.getCurrentDateMonth !== currentMonth) {
    // console.log('onBeforeMount');
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
