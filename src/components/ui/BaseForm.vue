<template>
  <BaseSurface>
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
  </BaseSurface>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { ref } from 'vue';
import type { ITodo } from '@/types';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from './BaseSurface.vue';

const title = ref('');
const description = ref('');

const calendarStore = useCalendarStore();

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
</script>
