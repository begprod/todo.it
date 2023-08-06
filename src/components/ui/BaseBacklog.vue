<template>
  <div class="grid gap-5 mt-5">
    <draggableComponent
      class="flex flex-col gap-5"
      :list="calendarStore.getBacklogTasks"
      :group="{ name: 'tasks', pull: null, put: true }"
      handle=".grab-handle"
      item-key="id"
      ghost-class="opacity-50"
      drag-class="opacity-50"
      @start="drag = true"
      @end="drag = false"
      @change="onDragChange"
      @unchoose="onDragUpdate"
      :component-data="{
        tag: 'div',
        type: 'transition',
        name: !drag ? 'flip-list' : null,
      }"
    >
      <template #item="{ element }">
        <BaseTask
          :task="element"
        />
      </template>
    </draggableComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
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
