<template>
  <h1>Hello</h1>
</template>

<script setup lang="ts">
import { startOfMonth, endOfMonth, eachWeekOfInterval, format } from 'date-fns';


const currentDate = new Date();
const startMonth = startOfMonth(currentDate);
const endMonth = endOfMonth(currentDate);
const weeks = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });

weeks.forEach((week) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(week);

    day.setDate(day.getDate() + i);

    return day;
  });

  const currentMonthWeekDays = weekDays.filter((day) => day.getMonth() === currentDate.getMonth());

  const weekString = currentMonthWeekDays
    .map((day) => {
      const dayString = format(day, 'd');
      const dayName = format(day, 'EEEE');

      // console.log(format(day, 'EEEE'));

      return `${dayString} (${dayName})`;
    }).join(' ');

  // eslint-disable-next-line no-console
  console.log(weekString);
});


// function getMonthData(currentDate, startMonth, endMonth) {}
</script>
