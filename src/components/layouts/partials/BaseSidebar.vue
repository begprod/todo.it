<template>
  <div class="shrink-0 md:mr-10 mb-10 md:mb-0 md:max-w-xs bg-white">
    <div
      class="sticky top-20 flex flex-col shrink-0 basis-3/12 md:max-h-[calc(100vh-120px)] md:min-h-[calc(100vh-120px)] overflow-x-scroll rounded-xl"
    >
      <BaseButton
        v-if="!commonStore.isSidebarOpen"
        class="w-full md:!w-12 mb-5 md:mb-0 shrink-0"
        type="button"
        title="Toggle backlog"
        @click="toggleSidebar"
      >
        <div class="mr-4 md:mr-0">
          <v-icon name="bi-layout-sidebar-inset" />
        </div>
        <span class="md:hidden">Open backlog</span>
      </BaseButton>

      <template v-if="commonStore.isSidebarOpen">
        <div class="sticky top-0 flex gap-1 bg-white shadow-lg shadow-white z-20">
          <BaseButton
            class="!w-12 mr-2 shrink-0"
            type="button"
            title="Close sidebar"
            @click="toggleSidebar"
          >
            <v-icon name="bi-layout-sidebar-inset" />
          </BaseButton>
          <BaseButton class="leading-none" type="button" @click="addTaskToBacklog">
            Add task to backlog
            <template #rightIcon>
              <div class="ml-4">
                <v-icon name="hi-plus" />
              </div>
            </template>
          </BaseButton>
        </div>

        <BaseBacklog />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { onBeforeMount, onUnmounted } from 'vue';
import { useCommonStore, useCalendarStore } from '@/stores';
import type { ITask } from '@/types';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseBacklog from '@/components/ui/BaseBacklog.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();

onBeforeMount(() => {
  windowResizeHandler();

  window.addEventListener('resize', windowResizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', windowResizeHandler);
});

const windowResizeHandler = () => {
  if (window.innerWidth <= 1024) {
    commonStore.closeSidebar();
  }
};

const addTaskToBacklog = () => {
  const task: ITask = {
    id: uniqid(),
    title: '',
    description: '',
    dayId: null,
    isDone: false,
  };

  calendarStore.addTaskToBacklog(task);
};

const toggleSidebar = () => {
  commonStore.toggleSidebar();
};
</script>
