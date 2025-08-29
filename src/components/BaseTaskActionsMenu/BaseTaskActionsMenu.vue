<template>
  <BasePopup :is-visible="isTaskActionMenuOpen" @close="closeTaskActionMenu">
    <BaseButton
      :color="originalTaskFromStore?.isDone ? 'default' : 'success'"
      :title="originalTaskFromStore?.isDone ? 'Mark as undone' : 'Mark as done'"
      variant="action"
      @click="
        originalTaskFromStore &&
        updateTask(
          originalTaskFromStore.id,
          originalTaskFromStore.dayId,
          'isDone',
          !originalTaskFromStore.isDone,
        )
      "
    >
      <template #leftIcon>
        <BadgeCheck class="icon icon_lg" />
      </template>
      {{ originalTaskFromStore?.isDone ? 'Mark as undone' : 'Mark as done' }}
    </BaseButton>
    <BaseButton variant="action" title="Duplicate" @click="copyCurrentTask()">
      <template #leftIcon>
        <Copy class="icon icon_lg" />
      </template>
      Duplicate {{ copyCount > 0 ? `(${copyCount})` : '' }}
    </BaseButton>
    <BaseButton
      v-if="currentEditingTask?.dayId !== 'backlog'"
      variant="action"
      title="Move to backlog"
      @click="moveTaskToBacklog()"
    >
      <template #leftIcon>
        <Undo class="icon icon_lg" />
      </template>
      Move to backlog
    </BaseButton>
    <div>
      <BaseButton
        v-if="!showDeleteConfirmation"
        variant="action"
        color="alert"
        title="Delete"
        @click="showDeleteConfirmation = !showDeleteConfirmation"
      >
        <template #leftIcon>
          <Trash2 class="icon icon_lg" />
        </template>
        Delete
      </BaseButton>
      <BaseButton
        v-if="showDeleteConfirmation"
        variant="action"
        color="secondary"
        background="alert"
        title="Confirm deletion"
        @click="removeTask()"
      >
        <template #leftIcon>
          <Trash2 class="icon icon_lg" />
        </template>
        Confirm deletion
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { BadgeCheck, Copy, Undo, Trash2 } from 'lucide-vue-next';
import { useCommonStore, useTasksStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { currentEditingTask, isTaskActionMenuOpen } = storeToRefs(commonStore);
const { tasks } = storeToRefs(tasksStore);
const { closeTaskActionMenu } = commonStore;
const { updateTask, duplicateTask, deleteTask, moveToBacklog } = tasksStore;
const copyCount = ref<number>(0);
const showDeleteConfirmation = ref<boolean>(false);
const originalTaskFromStore = computed(() => {
  return (
    currentEditingTask.value &&
    tasks.value[currentEditingTask.value?.dayId]?.items.find(
      (task) => task.id === currentEditingTask.value?.id,
    )
  );
});

watch(isTaskActionMenuOpen, (newValue: boolean) => {
  if (newValue) {
    showDeleteConfirmation.value = false;
    copyCount.value = 0;
  }
});

const copyCurrentTask = () => {
  if (!currentEditingTask.value) {
    return;
  }

  duplicateTask(currentEditingTask.value);

  copyCount.value += 1;
};

const moveTaskToBacklog = () => {
  if (!currentEditingTask.value) {
    return;
  }

  moveToBacklog(currentEditingTask.value.id, currentEditingTask.value.dayId);
  closeTaskActionMenu();
};

const removeTask = () => {
  if (!currentEditingTask.value) {
    return;
  }

  deleteTask(currentEditingTask.value.id, currentEditingTask.value.dayId);
  closeTaskActionMenu();
};

defineExpose({
  copyCurrentTask,
  moveTaskToBacklog,
  removeTask,
});
</script>
