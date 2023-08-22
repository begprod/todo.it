<template>
  <div class="mt-5 max-h-60 lg:max-h-none">
    <draggableComponent
      id="backlogArea"
      class="grid gap-5"
      :list="calendarStore.getBacklogTasks"
      :group="{ name: 'tasks', pull: null, put: true }"
      handle=".grab-handle"
      item-key="id"
      ghost-class="opacity-50"
      drag-class="drag"
      @start="drag = true"
      @end="drag = false"
      @change="onDragChange"
      @unchoose="onDragUpdate"
    >
      <template #item="{ element }">
        <BaseTask :task="element" />
      </template>
    </draggableComponent>

    <div
      v-if="!calendarStore.getBacklogTasks.length"
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
const newDayId = ref<string | null>(null);

const onDragChange = (event: IOnDragChangeEvent) => {
  const dayId = newDayId.value;

  if (event.added) {
    const task = event.added.element;

    calendarStore.updateTask({
      ...task,
      dayId: dayId,
    });
  }

  newDayId.value = null;
};

const onDragUpdate = (event: IOnDragChangeEvent) => {
  newDayId.value = event.to.id || null;
};
</script>

<style scoped lang="scss">
.drag {
  position: relative;
  opacity: 50;
  z-index: 9999;
}
</style>
