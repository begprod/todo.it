<template>
  <div class="relative flex flex-col grow gap-5 mx-3 bg-white">
    <div v-for="month in months" :key="month.id">
      <BaseAccordion
        v-for="day in getDaysByMonthId(month.id)"
        :class="day.isCurrent ? 'current-day' : ''"
        :key="day.id"
        :is-open="true"
        :is-active="day.isCurrent"
        additional-classes="sticky top-0 z-20"
      >
        <template #title>
          <BaseButton
            v-if="!isBacklogOpen && day.isCurrent"
            class="mr-2 !w-8"
            title="Expand backlog sidebar"
            @click="toggleSidebar"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </BaseButton>

          <div class="flex lg:items-center">
            <div
              v-if="day.isCurrent"
              class="shrink-0 w-3 h-3 mt-1 lg:mt-0 mr-2 rounded-[4px] bg-emerald-400 shadow-sm animate-pulse select-none"
            />

            <div class="flex lg:items-center flex-col md:flex-row">
              <span
                :class="{
                  'font-semibold': day.isCurrent,
                }"
              >
                {{ month.name }}
              </span>

              <span class="px-2 text-neutral-400 hidden md:block">/</span>

              <span
                :class="{
                  'font-semibold': day.isCurrent,
                }"
              >
                {{ day.name }} {{ day.number }}
              </span>
            </div>
          </div>
        </template>

        <template #action>
          <BaseButton
            v-if="!day.isPast"
            class="whitespace-nowrap"
            @click="createTask(day.id)"
            title="Add task"
          >
            Add task
            <template #rightIcon>
              <PlusIcon class="shrink-0 w-4 h-4 ml-2" />
            </template>
          </BaseButton>
        </template>

        <template #content>
          <draggableComponent
            :list="tasks[day.id].items"
            :group="{ name: 'tasks', pull: null, put: !day.isPast }"
            class="grid gap-5"
            handle=".grab-handle"
            item-key="id"
            ghost-class="opacity-50"
            drag-class="drag"
            @start="drag = true"
            @end="drag = false"
            @change="onDragChange($event, day.id)"
          >
            <template #item="{ element }">
              <BaseTask :task="element" />
            </template>
          </draggableComponent>

          <BaseEmptyListMessage
            v-if="!tasks[day.id].items.length"
            message="No tasks for this day"
          />
        </template>
      </BaseAccordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IOnDragChangeEvent } from '@/types';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import draggableComponent from 'vuedraggable';
import { PlusIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { useCommonStore, useCalendarStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

const commonStore = useCommonStore();
const calendarStore = useCalendarStore();
const tasksStore = useTasksStore();
const drag = ref<boolean>(false);
const { toggleSidebar } = commonStore;
const { isBacklogOpen } = storeToRefs(commonStore);
const { months } = storeToRefs(calendarStore);
const { getDaysByMonthId } = calendarStore;
const { tasks } = storeToRefs(tasksStore);
const { createTask, updateTask } = tasksStore;

onMounted(() => {
  const currentDayElement = document.getElementsByClassName('current-day')[0];

  if (currentDayElement) {
    currentDayElement.scrollIntoView({
      block: 'start',
    });
  }
});

const onDragChange = (event: IOnDragChangeEvent, dayId: string) => {
  if (event.added) {
    const task = event.added.element;

    task.dayId = dayId;

    updateTask(task.id, task.dayId, 'dayId', dayId);
  }
};
</script>

<style scoped lang="scss">
.drag {
  position: relative;
  opacity: 50;
  z-index: 9999;
}
</style>
