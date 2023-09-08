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

    <BaseEmptyListMessage v-if="!tasks.backlog.items.length" message="No tasks in backlog" />
  </div>
</template>

<script setup lang="ts">
import draggableComponent from 'vuedraggable';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { IOnDragChangeEvent } from '@/types';
import { useTasksStore } from '@/stores';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage.vue';
import BaseTask from '@/components/BaseTask.vue';

const tasksStore = useTasksStore();
const drag = ref<boolean>(false);
const { tasks } = storeToRefs(tasksStore);
const { updateTask } = tasksStore;

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
