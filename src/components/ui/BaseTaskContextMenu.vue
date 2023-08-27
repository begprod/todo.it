<template>
  <BaseContextMenu
    :is-menu-visible="commonStore.getIsContextMenuOpen"
    @close="commonStore.toggleContextMenu"
  >
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
      @click="calendarStore.copyTask(currentEditingTask)"
    >
      <template #leftIcon>
        <div class="mr-3">
          <v-icon name="md-copyall-round" />
        </div>
      </template>
      Copy
    </BaseButton>
    <BaseButton
      class="!p-3 lg:!p-5 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
      :class="{
        '!text-teal-500': !originalTaskFromStore?.isDone,
      }"
      @click="
        originalTaskFromStore &&
          calendarStore.updateTask(
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
        @click="deleteTask"
      >
        <template #leftIcon>
          <div class="mr-3">
            <v-icon name="md-deleteoutline" />
          </div>
        </template>
        Confirm deletion
      </BaseButton>
    </div>
  </BaseContextMenu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommonStore, useCalendarStore } from '@/stores';
import type { ICalendarStore } from '@/types';
import BaseContextMenu from '@/components/ui/BaseContextMenu.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

interface IProps {
  currentEditingTask: ICalendarStore['currentEditingTask'];
}

const props = defineProps<IProps>();

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();

const { isContextMenuOpen } = storeToRefs(commonStore);
const showDeleteConfirmation = ref<boolean>(false);

const originalTaskFromStore = computed(() => {
  if (!props.currentEditingTask) {
    return null;
  }

  return calendarStore.getTasks[props.currentEditingTask?.dayId].items.find(
    (task) => task.id === props.currentEditingTask?.id,
  );
});

watch(isContextMenuOpen, (newValue: boolean) => {
  if (newValue) {
    showDeleteConfirmation.value = false;
  }
});

const deleteTask = () => {
  if (!props.currentEditingTask) {
    return;
  }

  calendarStore.deleteTask(props.currentEditingTask.id, props.currentEditingTask.dayId);
  commonStore.toggleContextMenu();
};

const moveTaskToBacklog = () => {
  if (!props.currentEditingTask) {
    return;
  }

  calendarStore.moveToBacklog(props.currentEditingTask.id, props.currentEditingTask.dayId);
  commonStore.toggleContextMenu();
};
</script>
