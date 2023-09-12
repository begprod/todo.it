<template>
  <BasePopup :is-visible="isActionMenuOpen" @close="toggleTaskActionMenu">
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
      @click="copyCurrentTask"
    >
      <template #leftIcon>
        <div class="mr-3">
          <v-icon name="md-copyall-round" />
        </div>
      </template>
      Copy {{ copyCount > 0 ? `(${copyCount})` : '' }}
    </BaseButton>
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
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
    >
      <template #leftIcon>
        <div class="mr-3">
          <v-icon name="md-done" />
        </div>
      </template>
      {{ originalTaskFromStore?.isDone ? 'Mark as undone' : 'Mark as done' }}
    </BaseButton>
    <BaseButton
      v-if="currentEditingTask?.dayId !== 'backlog'"
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
      @click="moveTaskToBacklog"
    >
      <template #leftIcon>
        <div class="mr-3">
          <v-icon name="md-moveup-round" />
        </div>
      </template>
      Move to backlog
    </BaseButton>
    <div>
      <BaseButton
        v-if="!showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-red-500 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="showDeleteConfirmation = !showDeleteConfirmation"
      >
        <template #leftIcon>
          <div class="mr-3">
            <v-icon name="md-deleteoutline" />
          </div>
        </template>
        Delete
      </BaseButton>
      <BaseButton
        v-if="showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-white !bg-red-600 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="removeTask"
      >
        <template #leftIcon>
          <div class="mr-3">
            <v-icon name="md-deleteoutline" />
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
import { useCommonStore, useTasksStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { isActionMenuOpen } = storeToRefs(commonStore);
const { tasks, currentEditingTask } = storeToRefs(tasksStore);
const { toggleTaskActionMenu } = commonStore;
const { updateTask, copyTask, deleteTask, moveToBacklog } = tasksStore;
const copyCount = ref<number>(0);
const showDeleteConfirmation = ref<boolean>(false);
const originalTaskFromStore = computed(() => {
  return (
    currentEditingTask.value &&
    tasks.value[currentEditingTask.value?.dayId].items.find(
      (task) => task.id === currentEditingTask.value?.id,
    )
  );
});

watch(isActionMenuOpen, (newValue: boolean) => {
  if (newValue) {
    showDeleteConfirmation.value = false;
    copyCount.value = 0;
  }
});

const copyCurrentTask = () => {
  if (!currentEditingTask.value) {
    return;
  }

  copyTask(currentEditingTask.value);

  copyCount.value += 1;
};

const removeTask = () => {
  if (!currentEditingTask.value) {
    return;
  }

  deleteTask(currentEditingTask.value.id, currentEditingTask.value.dayId);
  toggleTaskActionMenu();
};

const moveTaskToBacklog = () => {
  if (!currentEditingTask.value) {
    return;
  }

  moveToBacklog(currentEditingTask.value.id, currentEditingTask.value.dayId);
  toggleTaskActionMenu();
};
</script>
