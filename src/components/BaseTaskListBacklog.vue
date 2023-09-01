<template>
  <div class="w-full lg:w-80 max-h-60 lg:max-h-none overflow-y-scroll">
    <draggableComponent
      class="grid gap-5 mt-5"
      :list="tasks.backlog.items"
      :group="{ name: 'tasks', pull: null, put: true }"
      handle=".grab-handle"
      item-key="id"
      ghost-class="opacity-50"
      drag-class="drag"
      @start="drag = true"
      @end="drag = false"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <BaseTask :task="element" />
      </template>
    </draggableComponent>

    <div
      v-if="!tasks.backlog.items.length"
      class="flex items-center justify-center h-16 text-sm lg:text-lg text-neutral-200"
    >
      <v-icon class="mr-2" name="md-cancel-outlined" />
      No tasks in backlog
    </div>
  </div>
</template>

<script setup lang="ts">
import draggableComponent from 'vuedraggable';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { IOnDragChangeEvent } from '@/types';
import { useCalendarStore } from '@/stores';
import BaseTask from '@/components/BaseTask.vue';

const calendarStore = useCalendarStore();
const drag = ref<boolean>(false);
const { tasks } = storeToRefs(calendarStore);
const { updateTask } = calendarStore;

const onDragChange = (event: IOnDragChangeEvent) => {
  if (event.added) {
    const task = event.added.element;

    task.dayId = 'backlog';

    updateTask(task.id, task.dayId, 'dayId', 'backlog');
  }
};
</script>

<style scoped lang="scss">
.drag {
  position: relative;
  opacity: 50;
  z-index: 9999;
}
</style>
