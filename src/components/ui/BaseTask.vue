<template>
  <div
    class="flex items-start p-4 rounded-md bg-sky-100 border-sky-300"
    :class="wrapperClasses"
  >
    <div
      class="grab-handle flex flex-shrink-0 h-full mr-2 rounded-md border-8 border-inherit cursor-grab"
      :class="innerClasses"
    />

    <div class="flex flex-col flex-grow">
      <div
        ref="titleRef"
        class="title max-w-full p-2 text-lg break-all rounded-md font-semibold focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="contenteditableClasses"
        :contenteditable="!task.isDone"
        title="Click to edit"
        data-placeholder="Type task title"
        @input="titleUpdate"
        @blur="updateTask"
      />
      <div
        ref="descriptionRef"
        class="description text-sm p-2 border-none outline-none rounded-md focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="contenteditableClasses"
        :contenteditable="!task.isDone"
        title="Click to edit"
        data-placeholder="Type task description"
        @input="descriptionUpdate"
        @blur="updateTask"
      />
    </div>

    <div class="flex flex-shrink-0">
      <BaseDropdownMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ITask } from '@/types';
import { useCalendarStore } from '@/stores/calendar';
import BaseDropdownMenu from '@/components/ui/BaseDropdownMenu.vue';

interface IProps {
  task: ITask;
}

const calendarStore = useCalendarStore();
const props = defineProps<IProps>();
const titleRef = ref<HTMLElement>();
const title = ref<string>(props.task.title);
const titleIsEmpty = ref<boolean>(true);
const descriptionRef = ref<HTMLElement>();
const description = ref<string>(props.task.description);
const descriptionIsEmpty = ref<boolean>(true);

onMounted(() => {
  if (title.value) {
    if (titleRef.value) {
      titleRef.value.innerHTML = title.value;
      titleIsEmpty.value = false;
    }
  }

  if (description.value) {
    if (descriptionRef.value) {
      descriptionRef.value.innerHTML = description.value;
      descriptionIsEmpty.value = false;
    }
  }
});

const titleUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  title.value = innerHTML || '';
  titleIsEmpty.value = title.value === '';
};

const descriptionUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  description.value = innerHTML || '';
  descriptionIsEmpty.value = description.value === '';
};

const updateTask = () => {
  const task = {
    ...props.task,
    title: title.value,
    description: description.value,
  };

  calendarStore.updateTask(task);
};

const wrapperClasses = computed(() => ({
  '!bg-emerald-50 border-green-200 cursor-default': props.task.isDone,
  '!bg-neutral-100 border-gray-300 cursor-default': props.task.dayId === null && !props.task.isDone,
}));

const innerClasses = computed(() => ({
  'pointer-events-none opacity-25': props.task.isDone
}));

const contenteditableClasses = computed(() => ({
  'is-active-placeholder': titleIsEmpty.value && !props.task.isDone,
  'opacity-25': props.task.isDone,
}));
</script>

<style scoped lang="scss">
.is-active-placeholder {
  &::after {
    content: attr(data-placeholder);
    opacity: .3;
  }
}
</style>
