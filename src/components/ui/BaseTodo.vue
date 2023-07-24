<template>
  <div
    class="flex p-4 rounded-md bg-sky-100 border-sky-300 transition-all duration-300"
    :class="classes"
  >
    <div class="h-full mr-2 rounded-md border-2 border-inherit"></div>
    <div>
      <h3
        ref="titleRef"
        class="max-w-full p-2 text-lg break-all rounded-md font-semibold focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        contenteditable="true"
        title="Click to edit"
      >
        {{ todo.title }}
      </h3>
      <div
        class="text-sm p-2 border-none outline-none rounded-md focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        contenteditable="true"
        title="Click to edit"
      >
        {{ todo.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ITodo } from '@/types';

interface IProps {
  todo: ITodo;
}

const props = defineProps<IProps>();
const titleRef = ref<HTMLElement>();

onMounted(() => {
  titleRef.value?.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(titleRef.value!);
  selection?.removeAllRanges();
  selection?.addRange(range);
});

const classes = computed(() => ({
  '!bg-green-200 border-green-400 opacity-20 cursor-default pointer-events-none': props.todo.isDone,
}));
</script>
