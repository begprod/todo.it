<template>
  <div
    class="group flex items-start p-4 rounded-md bg-sky-100 border-sky-300"
    :class="containerClasses"
  >
    <div
      class="grab-handle relative invisible flex flex-shrink-0 h-full mr-2 rounded-md border-8 border-inherit cursor-grab group-hover:visible"
    >
      <v-icon
        name="oi-grabber"
        class="absolute w-6 h-6 top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/2 opacity-30"
      />
    </div>

    <div class="flex flex-col flex-grow">
      <div
        ref="titleRef"
        class="title max-w-full p-2 text-lg break-all rounded-md font-semibold focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="contenteditableTitleClasses"
        :contenteditable="!task.isDone"
        title="Click to edit"
        data-placeholder="Type task title"
        @input="titleUpdate"
        @blur="updateTask"
        @keyup.esc="onEscape"
      />
      <div
        ref="descriptionRef"
        class="description text-sm p-2 border-none outline-none rounded-md focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
        :class="contenteditableDescriptionClasses"
        :contenteditable="!task.isDone"
        title="Click to edit"
        data-placeholder="Type task description"
        @input="descriptionUpdate"
        @blur="updateTask"
        @keyup.esc="onEscape"
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
          type="button"
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
          type="button"
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
          v-show="!deleteTaskConfirmationIsVisible"
          class="px-2 py-2 !text-sm !justify-start text-red-500 border-none !shadow-none hover:shadow-none hover:bg-slate-100"
          type="button"
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
          class="px-2 py-2 !text-sm !justify-start text-white !bg-red-400 border-none !shadow-none hover:shadow-none hover:!bg-red-600"
          type="button"
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
import { ref, computed, watch, onMounted } from 'vue';
import type { ITask } from '@/types';
import { useCalendarStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseDropdownMenu from '@/components/ui/BaseDropdownMenu.vue';

interface IProps {
  task: ITask;
}

const calendarStore = useCalendarStore();
const props = defineProps<IProps>();
const titleRef = ref<HTMLElement>();
const title = ref<string>(props.task.title);
const titleIsEmpty = ref<boolean>(true);
const descriptionRef = ref<HTMLElement>();
const description = ref<string>(props.task.description);
const descriptionIsEmpty = ref<boolean>(true);
const isDone = ref<boolean>(props.task.isDone);
const deleteTaskConfirmationIsVisible = ref<boolean>(false);
const isMenuOpen = ref<boolean>(false);

onMounted(() => {
  if (title.value) {
    if (titleRef.value) {
      titleRef.value.innerHTML = title.value;
      titleIsEmpty.value = false;
    }
  }

  if (!title.value) {
    if (titleRef.value) {
      titleRef.value.focus();
    }
  }

  if (description.value) {
    if (descriptionRef.value) {
      descriptionRef.value.innerHTML = description.value;
      descriptionIsEmpty.value = false;
    }
  }
});

watch(isMenuOpen, (newValue) => {
  if (newValue) {
    deleteTaskConfirmationIsVisible.value = false;
  }
});

const titleUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  title.value = innerHTML || '';
  titleIsEmpty.value = title.value === '';
};

const descriptionUpdate = (event: Event) => {
  const { innerHTML } = event.target as HTMLElement;

  description.value = innerHTML || '';
  descriptionIsEmpty.value = description.value === '';
};

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

const onEscape = () => {
  if (titleRef.value) {
    titleRef.value.blur();
  }

  if (descriptionRef.value) {
    descriptionRef.value.blur();
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const containerClasses = computed(() => ({
  '!bg-teal-50 !border-teal-200': props.task.isDone,
  '!bg-gray-100 !border-gray-300': props.task.dayId === null && !props.task.isDone,
}));

const contenteditableTitleClasses = computed(() => ({
  'is-active-placeholder': titleIsEmpty.value && !props.task.isDone,
  'opacity-25': props.task.isDone,
}));

const contenteditableDescriptionClasses = computed(() => ({
  'is-active-placeholder': descriptionIsEmpty.value && !props.task.isDone,
  'opacity-25': props.task.isDone,
}));
</script>

<style scoped lang="scss">
.is-active-placeholder {
  &::after {
    content: attr(data-placeholder);
    opacity: 0.3;
  }
}
</style>
