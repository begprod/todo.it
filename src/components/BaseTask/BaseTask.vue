<template>
  <div
    class="group flex items-start p-2 !pr-0 lg:p-4 bg-sky-200 border-sky-300 rounded-md"
    :class="classes"
  >
    <div
      class="grab-handle relative xl:opacity-0 flex flex-shrink-0 h-full mr-2 rounded-md border-[10px] lg:border-8 border-inherit cursor-grab group-hover:opacity-100 transition-opacity duration-300"
    >
      <v-icon
        name="oi-grabber"
        class="absolute w-6 h-6 top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/2 opacity-30"
      />
    </div>

    <div class="flex flex-col flex-grow">
      <BaseContentEditableInput
        v-model="title"
        title="Click to edit"
        placeholder="Type task title"
        font-weight="semibold"
        :is-content-editable="isContentEditable(task.isDone)"
        :is-required="true"
      />
      <BaseContentEditableInput
        v-model="description"
        title="Click to edit"
        placeholder="Type task description"
        text-size="sm"
        font-weight="normal"
        :is-content-editable="isContentEditable(task.isDone)"
      />
    </div>

    <div class="flex flex-shrink-0">
      <BaseButton
        class="pt-0 pr-0 !bg-transparent border-transparent !shadow-none hover:shadow-none"
        title="Open menu"
        @click="openActionMenu"
      >
        <v-icon name="hi-dots-vertical" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { watchThrottled } from '@vueuse/core';
import type { ITask } from '@/types';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';

interface IProps {
  task: ITask;
}

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const props = defineProps<IProps>();
const title = ref<string>(props.task.title);
const description = ref<string>(props.task.description);
const { setCurrentEditingTask, toggleTaskActionMenu } = commonStore;
const { updateTask } = tasksStore;

const openActionMenu = () => {
  setCurrentEditingTask(props.task);
  toggleTaskActionMenu();
};

watchThrottled(
  title,
  () => {
    updateTask(props.task.id, props.task.dayId, 'title', title.value);
  },
  { throttle: 1000 },
);

watchThrottled(
  description,
  () => {
    updateTask(props.task.id, props.task.dayId, 'description', description.value);
  },
  { throttle: 1000 },
);

const classes = computed(() => ({
  '!bg-teal-100 !border-teal-200 line-through': props.task.isDone,
  '!bg-zinc-100 !border-gray-300': props.task.dayId === 'backlog' && !props.task.isDone,
}));

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; // fix for firefox, because it doesn't support contenteditable="plaintext-only"
const isContentEditable = (isDone: boolean) =>
  isDone ? false : isFirefox ? true : 'plaintext-only';
</script>
