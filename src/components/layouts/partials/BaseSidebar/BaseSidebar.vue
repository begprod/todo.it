<template>
  <div class="shrink-0 lg:mr-10 mb-20 lg:mb-0 bg-white">
    <div class="sticky top-20 flex flex-col rounded-xl z-[99]">
      <Transition>
        <div v-if="!isSidebarOpen" class="lg:h-auto mb10 lg:mr-10">
          <BaseButton
            class="absolute top-0 left-0 w-full lg:!w-12 shrink-0"
            title="Toggle backlog"
            @click="toggleSidebar"
          >
            <template #leftIcon>
              <div class="mr-4 lg:mr-0">
                <v-icon name="bi-layout-sidebar-inset" />
              </div>
            </template>
            <span class="lg:hidden">Open backlog</span>
          </BaseButton>
        </div>
      </Transition>

      <Transition>
        <div v-if="isSidebarOpen">
          <div class="flex gap-1 pb-3 bg-white z-10">
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

          <div class="lg:max-h-[calc(100vh-180px)] lg:min-h-[calc(100vh-180px)] overflow-y-auto">
            <BaseTaskListBacklog />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { isSidebarOpen } = storeToRefs(commonStore);
const { toggleSidebar } = commonStore;
const { createTask } = tasksStore;
</script>

<style scoped lang="scss">
.v {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(-100px);
  }
}
</style>
