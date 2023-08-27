<template>
  <div class="max-h-60 lg:max-h-none overflow-y-scroll">
    <draggableComponent
      class="grid gap-5 mt-5"
      :list="calendarStore.getTasks.backlog.items"
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
      v-if="!calendarStore.getTasks.backlog.items.length"
      class="flex items-center justify-center h-16 text-sm lg:text-lg text-neutral-200"
    >
      <v-icon class="mr-2" name="md-cancel-outlined" />
      No tasks in backlog
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCalendarStore } from '@/stores';
import type { IOnDragChangeEvent } from '@/types';
import draggableComponent from 'vuedraggable';
import BaseTask from '@/components/ui/BaseTask.vue';

const calendarStore = useCalendarStore();
const drag = ref<boolean>(false);

const onDragChange = (event: IOnDragChangeEvent) => {
  if (event.added) {
    const task = event.added.element;

    task.dayId = 'backlog';

    calendarStore.updateTask(task.id, task.dayId, 'dayId', 'backlog');
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
