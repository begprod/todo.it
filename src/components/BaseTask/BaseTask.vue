<template>
  <div
    class="group flex items-start p-3 bg-white border border-slate-300 rounded-md"
    :class="classes"
  >
    <div
      class="grab-handle relative xl:opacity-0 flex flex-shrink-0 h-full mr-3 rounded-md border-[10px] lg:border-8 border-slate-200 cursor-grab group-hover:opacity-100 transition-opacity duration-300"
    >
      <ChevronUpDownIcon
        class="absolute w-5 h-5 top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/2 opacity-30"
      />
    </div>

    <div class="flex flex-col flex-grow">
      <BaseContentEditableInput
        v-model="description"
        title="Click to edit"
        placeholder="Start type markdown"
        :is-required="true"
        :is-contenteditable="isContentEditable(task.isDone)"
      />
    </div>

    <div class="flex flex-shrink-0">
      <BaseButton class="pt-0 pr-0 !border-none" title="Open menu" @click="openActionMenu()">
        <EllipsisVerticalIcon class="w-6 h-6" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import { ref, computed } from 'vue';
import { watchThrottled } from '@vueuse/core';
import { EllipsisVerticalIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';

interface IProps {
  task: ITask;
}

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const props = defineProps<IProps>();
const description = ref<string>(props.task.description);
const { setCurrentEditingTask, openTaskActionMenu } = commonStore;
const { updateTask } = tasksStore;

watchThrottled(
  description,
  () => {
    updateTask(props.task.id, props.task.dayId, 'description', description.value);
  },
  { throttle: 1000 },
);

const openActionMenu = () => {
  setCurrentEditingTask(props.task);
  openTaskActionMenu();
};

const isContentEditable = (isDone: boolean) => (isDone ? false : true);

const classes = computed(() => ({
  'line-through opacity-30': props.task.isDone,
}));

defineExpose({
  openActionMenu,
});
</script>
