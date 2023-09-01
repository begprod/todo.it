<template>
  <div class="shrink-0 lg:mr-10 mb-10 lg:mb-0 bg-white">
    <div
      class="sticky top-20 flex flex-col lg:max-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-120px)] rounded-xl z-[99]"
    >
      <BaseButton
        v-if="!isSidebarOpen"
        class="w-full lg:!w-12 mb-5 lg:mb-0 shrink-0"
        title="Toggle backlog"
        @click="toggleSidebar"
      >
        <div class="mr-4 lg:mr-0">
          <v-icon name="bi-layout-sidebar-inset" />
        </div>
        <span class="lg:hidden">Open backlog</span>
      </BaseButton>

      <template v-if="isSidebarOpen">
        <div class="flex gap-1 bg-white shadow-lg shadow-white z-10">
          <BaseButton class="!w-12 mr-2 shrink-0" title="Close sidebar" @click="toggleSidebar">
            <v-icon name="bi-layout-sidebar-inset" />
          </BaseButton>
          <BaseButton class="leading-none" @click="createTask('backlog')">
            Add task to backlog
            <template #rightIcon>
              <div class="ml-4">
                <v-icon name="hi-plus" />
              </div>
            </template>
          </BaseButton>
        </div>

        <BaseTaskListBacklog />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore, useCalendarStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const { isSidebarOpen } = storeToRefs(commonStore);
const { toggleSidebar } = commonStore;
const { createTask } = calendarStore;
</script>
