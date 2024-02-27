<template>
  <BaseSidebar :is-open="isSidebarOpen">
    <div class="sticky top-0 mb-3 pt-4 px-3 bg-neutral-50 z-10">
      <div class="flex items-center justify-between mb-6">
        <BaseLogo />

        <div class="flex items-center">
          <a href="https://github.com/begprod/todo.it" target="_blank">
            <img
              src="@/assets/images/github-mark.svg"
              class="w-6 opacity-80 hover:opacity-100 transition-all duration-300"
              alt="todo.it github"
            />
          </a>
        </div>
      </div>

      <div class="flex items-center">
        <BaseButton class="mr-2 !w-8" title="Collapse backlog sidebar" @click="toggleSidebar">
          <QueueListIcon class="w-4 h-4 -rotate-90" />
        </BaseButton>

        <BaseButton @click="createTask('backlog')" title="Add task to backlog">
          Add to backlog
          <template #rightIcon>
            <div class="ml-4">
              <PlusIcon class="w-4 h-4" />
            </div>
          </template>
        </BaseButton>
      </div>
    </div>

    <div class="px-3">
      <BaseTaskListBacklog />
    </div>
  </BaseSidebar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { PlusIcon, QueueListIcon } from '@heroicons/vue/24/outline';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { toggleSidebar } = commonStore;
const { isSidebarOpen } = storeToRefs(commonStore);
const { createTask } = tasksStore;
</script>

<style scoped lang="scss">
.v-enter {
  &-active {
    transition: all 0.5s ease;
  }

  &-from {
    opacity: 0;
    transform: translateX(-100px);
  }
}

.v-leave {
  &-active {
    transition: all 0.5s ease;
  }

  &-to {
    opacity: 0;
    transform: translateX(-100px);
  }
}
</style>
