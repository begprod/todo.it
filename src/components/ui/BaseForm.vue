<template>
  <BaseSurface>
    <form @submit.prevent="onSubmit">
      <BaseInput
        id="title"
        type="text"
        placeholder="Type task title here"
        label="title"
        v-model="title"
        autocomplete="off"
        required
        autofocus
      />
      <BaseTextArea
        id="description"
        placeholder="Type task description here"
        label="description"
        v-model="description"
        rows="5"
      />
      <BaseButton
        type="submit"
      >
        Add task
        <template #rightIcon>
          <v-icon name="bi-plus-square" />
        </template>
      </BaseButton>
    </form>
  </BaseSurface>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { ref } from 'vue';
import type { ITodo } from '@/types';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from '@/components/ui/BaseSurface.vue';
import BaseInput from '@/components/ui/controls/BaseInput.vue';
import BaseTextArea from '@/components/ui/controls/BaseTextArea.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

const calendarStore = useCalendarStore();

const title = ref('');
const description = ref('');

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
