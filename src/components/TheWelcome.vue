<template>
  <div class="container mx-auto my-10 p-10 bg-gray-300 rounded-lg shadow-md">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="title">title</label>
        <input
          id="title"
          type="text"
          v-model="title"
        />
      </div>
      <div>
        <label for="description">description</label>
        <textarea
          id="description"
          name="description"
          cols="30"
          rows="10"
          v-model="description"
        />
      </div>
      <div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        >
        Add todo
      </button>
      </div>
    </form>
  </div>

  <div class="container mx-auto my-10 p-10 bg-gray-300 rounded-lg shadow-md">
    <div
      v-for="todo in calendarStore.allTodos"
      :key="todo.id"
    >
      {{ todo.title }}
      {{ todo.description }}
    </div>
  </div>


  <div class="container mx-auto my-10 p-10 bg-gray-300 rounded-lg shadow-md">
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
  </div>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { onMounted, ref } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import type { ITodo } from '@/types';

const calendarStore = useCalendarStore();
const title = ref('');
const description = ref('');

onMounted(() => {
  // const currentMonth = format(new Date(), 'MMMM');

  // if (calendarStore.getCurrentDateMonth !== currentMonth) {
    calendarStore.setCurrentMonth();
  // }
});

const onSubmit = () => {
  const todo: ITodo = {
    id: uniqid(),
    title: title.value,
    description: description.value,
    isDone: false,
  };

  calendarStore.addTodo(todo);

  title.value = '';
  description.value = '';
};

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
