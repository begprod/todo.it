<template>
  <div class="group flex p-3 border border-slate-300 rounded-md" :class="classes">
    <div
      class="grab-handle shrink-0 relative xl:opacity-0 flex h-full rounded-md border-[10px] lg:border-8 border-slate-200 cursor-grab group-hover:opacity-100 transition-opacity duration-300"
      data-test-id="task-drag-handle"
    >
      <GripVertical
        class="absolute w-4 h-4 top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/2 opacity-30"
      />
    </div>

    <div class="flex flex-col grow">
      <div class="flex items-start">
        <div class="flex flex-col grow px-3">
          <BaseContentEditableInput
            v-model="description"
            title="Click to edit"
            placeholder="Start type markdown"
            :is-required="true"
            :is-contenteditable="isContentEditable(task.isDone)"
            data-test-id="task-description-input"
          />
        </div>

        <div class="flex flex-col flex-shrink-0">
          <BaseButton
            class="p-[2px] !border-none xl:opacity-0 group-hover:opacity-100"
            title="Open task actions menu"
            data-test-id="task-actions-menu-button"
            @click="openActionMenu()"
          >
            <EllipsisVertical class="w-5 h-5" />
          </BaseButton>
          <BaseButton
            v-if="!task.isDone && task.labels"
            class="mt-1 p-[2px] !border-none xl:opacity-0 group-hover:opacity-100"
            data-test-id="task-labels-menu-button"
            @click="openLabelMenu()"
          >
            <Tags class="w-6 h-6" />
          </BaseButton>
        </div>
      </div>

      <div v-if="task?.labels?.length > 0" class="flex flex-wrap gap-2 mt-3 px-3">
        <BaseLabel
          v-for="label in task.labels"
          :key="label.id"
          :title="label.name"
          :scope-title="'scopeTitle' in label ? label.scopeTitle : null"
          :color="label.color"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from '@/types';
import { ref, computed } from 'vue';
import { watchThrottled } from '@vueuse/core';
import { GripVertical, EllipsisVertical, Tags } from 'lucide-vue-next';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';
import BaseLabel from '@/components/ui/BaseLabel/BaseLabel.vue';

interface IProps {
  task: ITask;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  backgroundColor: 'bg-white',
});

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const description = ref<string>(props.task.description);
const { setCurrentEditingTask, openTaskActionMenu, openTaskLabelMenu } = commonStore;
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

const openLabelMenu = () => {
  setCurrentEditingTask(props.task);
  openTaskLabelMenu();
};

const isContentEditable = (isDone: boolean) => (isDone ? false : true);

const classes = computed(() => ({
  'line-through opacity-30': props.task.isDone,
  'bg-white': props.backgroundColor === 'bg-white',
  'bg-neutral-50': props.backgroundColor === 'bg-neutral-50',
}));

defineExpose({
  openActionMenu,
  openLabelMenu,
});
</script>
