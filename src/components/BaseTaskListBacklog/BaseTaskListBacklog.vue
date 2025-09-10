<template>
  <div>
    <draggableComponent
      class="backlog"
      :list="tasks.backlog?.items"
      :group="{ name: 'tasks', pull: null, put: true }"
      handle=".grab-handle"
      item-key="id"
      ghost-class="ghost"
      drag-class="drag"
      @start="drag = true"
      @end="drag = false"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <BaseTask :task="element" />
      </template>
    </draggableComponent>

    <BaseEmptyListMessage v-if="!tasks.backlog?.items.length" message="No tasks in backlog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import draggableComponent from 'vuedraggable';
import type { IOnDragChangeEvent } from '@/types';
import { useTasksStore } from '@/stores';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

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

<style scoped>
.backlog {
  display: grid;
  gap: 1.25rem;
}
</style>
