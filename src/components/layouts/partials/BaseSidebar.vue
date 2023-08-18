<template>
  <div
    class="fixed md:static top-16 md:top-24 left-0 shrink-0 md:mr-10 px-5 md:px-0 max-w-[250px] md:max-w-xs md:!h-auto bg-white z-50 md:z-0"
    :class="{
      'h-full': commonStore.isSidebarOpen,
      'rounded-xl !pr-0': !commonStore.isSidebarOpen,
      'opacity-80 -translate-x-2/4 lg:opacity-100 lg:-translate-x-0': commonStore.isSidebarOnDrag,
    }"
  >
    <div
      class="sticky top-20 flex flex-col shrink-0 basis-3/12 overflow-x-scroll rounded-xl"
      :class="{
        'max-h-[calc(100vh-120px)] min-h-[calc(100vh-120px)]': commonStore.isSidebarOpen,
      }"
    >
      <BaseButton
        v-if="!commonStore.isSidebarOpen"
        class="!w-12 shrink-0"
        type="button"
        title="Toggle backlog"
        @click="toggleSidebar"
      >
        <v-icon name="bi-layout-sidebar-inset" />
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
            Add task
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
