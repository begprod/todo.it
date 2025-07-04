<template>
  <BasePopup :is-visible="isTaskActionMenuOpen" @close="closeTaskActionMenu">
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none"
      :class="{
        '!text-teal-500': !originalTaskFromStore?.isDone,
      }"
      @click="
        originalTaskFromStore &&
        updateTask(
          originalTaskFromStore.id,
          originalTaskFromStore.dayId,
          'isDone',
          !originalTaskFromStore.isDone,
        )
      "
      data-testid="mark-as-done-button"
    >
      <template #leftIcon>
        <div class="mr-3">
          <BadgeCheck class="w-6 h-6" />
        </div>
      </template>
      {{ originalTaskFromStore?.isDone ? 'Mark as undone' : 'Mark as done' }}
    </BaseButton>
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none"
      @click="copyCurrentTask()"
      data-testid="duplicate-task-button"
    >
      <template #leftIcon>
        <div class="mr-3">
          <Copy class="w-6 h-6" />
        </div>
      </template>
      Duplicate {{ copyCount > 0 ? `(${copyCount})` : '' }}
    </BaseButton>
    <BaseButton
      v-if="currentEditingTask?.dayId !== 'backlog'"
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none"
      @click="moveTaskToBacklog()"
      data-testid="move-to-backlog-button"
    >
      <template #leftIcon>
        <div class="mr-3">
          <Undo class="w-6 h-6" />
        </div>
      </template>
      Move to backlog
    </BaseButton>
    <div>
      <BaseButton
        v-if="!showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-red-500 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="showDeleteConfirmation = !showDeleteConfirmation"
        data-testid="delete-task-button"
      >
        <template #leftIcon>
          <div class="mr-3">
            <Trash2 class="w-6 h-6" />
          </div>
        </template>
        Delete
      </BaseButton>
      <BaseButton
        v-if="showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-white !bg-red-600 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="removeTask()"
        data-testid="confirm-delete-task-button"
      >
        <template #leftIcon>
          <div class="mr-3">
            <Trash2 class="w-6 h-6" />
          </div>
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
