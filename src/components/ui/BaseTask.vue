<template>
  <div
    class="flex p-4 rounded-md bg-sky-100 border-sky-300"
    :class="classes"
  >
    <div class="grab-handle h-full mr-2 rounded-md border-8 border-inherit cursor-grab"></div>
    <div>
      <div
        v-memo="title"
        ref="titleRef"
        class="title max-w-full p-2 text-lg break-all rounded-md font-semibold focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="{ 'is-active-placeholder': titleIsEmpty }"
        contenteditable="true"
        title="Click to edit"
        data-placeholder="Type task title here"
        @input="titleUpdate"
        @blur="updateTask"
      >
      </div>
      <div
        v-memo="description"
        class="description text-sm p-2 border-none outline-none rounded-md focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="{ 'is-active-placeholder': descriptionIsEmpty }"
        contenteditable="true"
        title="Click to edit"
        data-placeholder="Type task description here"
        @input="descriptionUpdate"
        @blur="updateTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { ITask } from '@/types';
import { useCalendarStore } from '@/stores/calendar';

interface IProps {
  task: ITask;
}

const calendarStore = useCalendarStore();
const props = defineProps<IProps>();
const titleRef = ref<HTMLElement>();
const title = ref<string>(props.task.title);
const titleIsEmpty = ref<boolean>(true);
const description = ref<string>(props.task.description);
const descriptionIsEmpty = ref<boolean>(true);

onMounted(() => {
  titleRef.value?.focus();
});

watch(title, (value) => {
  titleIsEmpty.value = value === '';
});

watch(description, (value) => {
  descriptionIsEmpty.value = value === '';
});

const titleUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  title.value = innerHTML || '';
};

const descriptionUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  description.value = innerHTML || '';
};

const updateTask = () => {
  calendarStore.updateTask({
    ...props.task,
    title: title.value,
    description: description.value,
  });
};

const classes = computed(() => ({
  '!bg-green-200 border-green-400 opacity-20 cursor-default pointer-events-none': props.task.isDone,
  '!bg-gray-100 border-gray-400 opacity-70 cursor-default': props.task.dayId === null,
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
