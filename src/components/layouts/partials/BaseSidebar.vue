<template>
  <div class="shrink-0 mr-10">
    <div class="sticky top-24 flex flex-col shrink-0 basis-3/12 max-h-[calc(100vh-120px)] overflow-x-scroll rounded-xl">
      <BaseButton
        v-if="!commonStore.isSidebarOpen"
        class="!justify-start !w-auto "
        type="button"
        title="Toggle backlog"
        @click="toggleSidebar"
      >
        <v-icon name="bi-layout-sidebar-inset" />
      </BaseButton>

      <template
        v-if="commonStore.isSidebarOpen"
      >
        <div class="sticky top-0 flex gap-1 bg-white shadow-lg shadow-white z-20">
          <BaseButton class="!justify-start !w-auto mr-2" type="button" title="Close sidebar" @click="toggleSidebar">
            <v-icon name="bi-layout-sidebar-inset" />
          </BaseButton>
          <BaseButton
            class="leading-none"
            type="button"
            @click="addTaskToBacklog"
          >
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
import { useCommonStore, useCalendarStore } from '@/stores';
import type { ITask } from '@/types';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseBacklog from '@/components/ui/BaseBacklog.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();

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
