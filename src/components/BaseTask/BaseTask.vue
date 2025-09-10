<template>
  <div class="task" :class="classes">
    <div class="grab-handle">
      <GripVertical class="icon icon_base" />
    </div>

    <div class="task__inner">
      <div class="task__wrapper">
        <div class="task__content">
          <BaseContentEditableInput
            v-model="description"
            title="Click to edit"
            placeholder="Start type markdown"
            :is-required="true"
            :is-contenteditable="isContentEditable(task.isDone)"
          />
        </div>

        <div class="task__controls">
          <BaseButton title="Open task actions menu" @click="openActionMenu()">
            <EllipsisVertical class="icon icon_base" />
          </BaseButton>
          <BaseButton
            v-if="!task.isDone && task.labels"
            title="Open label menu"
            @click="openLabelMenu()"
          >
            <Tags class="icon icon_base" />
          </BaseButton>
        </div>
      </div>

      <div v-if="task?.labels?.length > 0" class="task__labels">
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
}

const props = defineProps<IProps>();

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
  task_done: props.task.isDone,
}));

defineExpose({
  openActionMenu,
  openLabelMenu,
});
</script>

<style scoped>
.task {
  display: flex;
  padding: 0.75rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-md);
  border: 1px solid var(--color-bg-border);

  &:hover {
    .task__controls {
      opacity: 1;
    }

    .grab-handle {
      opacity: 1;
    }
  }
}

.task__inner {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.task__wrapper {
  display: flex;
}

.task__content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 0.75rem;
}

.task__controls {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0.5rem;
  opacity: 0;
  transition: 0.3s ease-in-out;
  transition-property: opacity;
}

.task__labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0 0.75rem;
}

.task_done {
  opacity: 0.5;
  text-decoration: line-through;
}

.grab-handle {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: var(--rounded-md);
  background-color: var(--color-bg-surface-secondary);
  opacity: 0;
  cursor: grab;
  transition: 0.3s ease-in-out;
  transition-property: opacity;
}

@media screen and (max-width: 1024px) {
  .task__controls {
    opacity: 1;
  }

  .grab-handle {
    opacity: 1;
  }
}
</style>
