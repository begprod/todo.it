<template>
  <div
    class="sticky top-0 shrink-0 lg:mr-4 mb-0 pb-3 bg-neutral-50 lg:border-r border-slate-300 max-h-60 lg:max-h-screen lg:min-h-screen overflow-y-auto hide-scrollbar"
  >
    <div class="flex flex-col">
      <div class="sticky top-0 mb-3 pt-4 px-3 bg-neutral-50 z-10">
        <div class="flex items-center justify-between mb-6">
          <BaseLogo />

          <a href="https://github.com/begprod/todo.it" target="_blank">
            <img
              src="@/assets/images/github-mark.svg"
              class="w-6 opacity-80 hover:opacity-100 transition-all duration-300"
              alt="todo.it github"
            />
          </a>
        </div>

        <BaseButton @click="createTask('backlog')" title="Add task to backlog">
          Add to backlog
          <template #rightIcon>
            <div class="ml-4">
              <PlusIcon class="w-4 h-4" />
            </div>
          </template>
        </BaseButton>
      </div>

      <div class="px-3">
        <BaseTaskListBacklog />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useTasksStore } from '@/stores';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

const tasksStore = useTasksStore();
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
