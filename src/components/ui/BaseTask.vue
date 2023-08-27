<template>
  <div
    class="group flex items-start p-2 !pr-0 lg:p-4 bg-sky-100 border-sky-300 rounded-md"
    :class="classes"
  >
    <div
      class="grab-handle relative xl:invisible flex flex-shrink-0 h-full mr-2 rounded-md border-[10px] lg:border-8 border-inherit cursor-grab group-hover:visible"
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
        :is-content-editable="!task.isDone"
        :is-required="true"
        @blur="calendarStore.updateTask(task.id, task.dayId, 'title', title)"
      />
      <BaseContentEditableInput
        v-model="description"
        title="Click to edit"
        placeholder="Type task description"
        text-size="sm"
        font-weight="normal"
        :is-content-editable="!task.isDone"
        @blur="calendarStore.updateTask(task.id, task.dayId, 'description', description)"
      />
    </div>

    <div class="flex flex-shrink-0">
      <BaseButton
        class="pt-0 pr-0 !bg-transparent border-transparent !shadow-none hover:shadow-none"
        title="Open menu"
        @click="openContextMenu"
      >
        <v-icon name="hi-dots-vertical" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ITask } from '@/types';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput.vue';

interface IProps {
  task: ITask;
}

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const props = defineProps<IProps>();
const title = ref<string>(props.task.title);
const description = ref<string>(props.task.description);

const openContextMenu = () => {
  calendarStore.setCurrentEditingTask(props.task);
  commonStore.toggleContextMenu();
};

const classes = computed(() => ({
  '!bg-teal-50 !border-teal-200': props.task.isDone,
  '!bg-gray-100 !border-gray-300': props.task.dayId === 'backlog' && !props.task.isDone,
}));
</script>
