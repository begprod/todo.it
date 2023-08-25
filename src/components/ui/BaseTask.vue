<template>
  <div
    class="group flex items-start p-2 !pr-0 lg:p-4 bg-sky-100 border-sky-300 rounded-md"
    :class="classes"
  >
    <div
      class="grab-handle relative xl:invisible flex flex-shrink-0 h-full mr-2 rounded-md border-[10px] lg:border-8 border-inherit cursor-grab group-hover:visible"
    >
      <v-icon
        name="oi-grabber"
        class="absolute w-6 h-6 top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/2 opacity-30"
      />
    </div>

    <div class="flex flex-col flex-grow">
      <BaseContentEditableInput
        v-model="title"
        title="Click to edit"
        placeholder="Type task title"
        font-weight="semibold"
        :is-content-editable="!task.isDone"
        :is-required="true"
        @blur="updateTask"
      />
      <BaseContentEditableInput
        v-model="description"
        title="Click to edit"
        placeholder="Type task description"
        text-size="sm"
        font-weight="normal"
        :is-content-editable="!task.isDone"
        @blur="updateTask"
      />
    </div>

    <div class="flex flex-shrink-0">
      <BaseDropdownMenu
        :is-menu-open="isMenuOpen"
        @toggle-menu="toggleMenu"
        @close-menu="closeMenu"
      >
        <BaseButton
          class="px-2 py-2 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
          @click="copyTask"
        >
          <template #leftIcon>
            <div class="mr-3">
              <v-icon name="md-copyall-round" />
            </div>
          </template>
          Copy
        </BaseButton>
        <BaseButton
          class="px-2 py-2 !text-sm !justify-start text-teal-500 border-none !shadow-none hover:shadow-none hover:bg-slate-100"
          :class="{
            '!text-neutral-600': isDone,
          }"
          @click="toggleTaskIsDone"
        >
          <template #leftIcon>
            <div class="mr-3">
              <v-icon name="md-done" />
            </div>
          </template>
          {{ isDone ? 'Mark as undone' : 'Mark as done' }}
        </BaseButton>
        <BaseButton
          v-if="task.dayId"
          class="px-2 py-2 !text-sm !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
          @click="moveTaskToBacklog()"
        >
          <template #leftIcon>
            <div class="mr-3 -scale-x-100">
              <v-icon name="md-moveup-round" />
            </div>
          </template>
          Move to backlog
        </BaseButton>
        <BaseButton
          v-show="!deleteTaskConfirmationIsVisible"
          class="px-2 py-2 !text-sm !justify-start text-red-500 border-none !shadow-none hover:shadow-none hover:bg-slate-100"
          @click="showDeleteConfirmation"
        >
          <template #leftIcon>
            <div class="mr-3">
              <v-icon name="md-deleteoutline" />
            </div>
          </template>
          Delete
        </BaseButton>
        <BaseButton
          v-show="deleteTaskConfirmationIsVisible"
          class="px-2 py-2 !text-sm !justify-start text-white !bg-red-600 border-none !shadow-none hover:shadow-none hover:!bg-red-700"
          @click="deleteTask"
        >
          <template #leftIcon>
            <div class="mr-3">
              <v-icon name="md-deleteoutline" />
            </div>
          </template>
          Confirm deletion
        </BaseButton>
      </BaseDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { ref, computed, watch } from 'vue';
import type { ITask } from '@/types';
import { useCalendarStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput.vue';
import BaseDropdownMenu from '@/components/ui/BaseDropdownMenu.vue';

interface IProps {
  task: ITask;
}

const calendarStore = useCalendarStore();
const props = defineProps<IProps>();
const title = ref<string>(props.task.title);
const description = ref<string>(props.task.description);
const isDone = ref<boolean>(props.task.isDone);
const deleteTaskConfirmationIsVisible = ref<boolean>(false);
const isMenuOpen = ref<boolean>(false);

watch(isMenuOpen, (newValue) => {
  if (newValue) {
    deleteTaskConfirmationIsVisible.value = false;
  }
});

const updateTask = () => {
  const task = {
    ...props.task,
    title: title.value,
    description: description.value,
    isDone: isDone.value,
  };

  calendarStore.updateTask(task);
};

const toggleTaskIsDone = () => {
  isDone.value = !isDone.value;

  updateTask();
};

const showDeleteConfirmation = () => {
  deleteTaskConfirmationIsVisible.value = true;
};

const copyTask = () => {
  const copiedTask = {
    ...props.task,
    id: uniqid(),
    isDone: false,
  };

  calendarStore.copyTask(props.task.id, copiedTask);
};

const deleteTask = () => {
  calendarStore.deleteTask(props.task);
};

const moveTaskToBacklog = () => {
  const task = {
    ...props.task,
    dayId: null,
  };

  calendarStore.deleteTask(props.task);
  calendarStore.addTaskToBacklog(task);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const classes = computed(() => ({
  '!bg-teal-50 !border-teal-200': props.task.isDone,
  '!bg-gray-100 !border-gray-300': props.task.dayId === null && !props.task.isDone,
}));
</script>
