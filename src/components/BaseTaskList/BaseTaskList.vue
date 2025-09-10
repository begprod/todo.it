<template>
  <div class="task-list">
    <template v-for="month in months" :key="month.id">
      <BaseAccordion
        v-for="day in getDaysByMonthId(month.id)"
        :class="day.isCurrent ? 'current-day' : ''"
        :key="day.id"
        :is-open="true"
        :is-header-sticky="true"
      >
        <template #title>
          <BaseButton
            v-if="!isBacklogOpen && day.isCurrent"
            class="task-list__sidebar-control"
            title="Expand backlog sidebar"
            @click="toggleSidebar"
          >
            <PanelLeftOpen class="icon icon_sm" />
          </BaseButton>

          <div class="task-list__title">
            <div v-if="day.isCurrent" class="task-list__dot animate-pulse" />

            <div class="task-list__title-inner">
              <span
                :class="{
                  'task-list__title_bold': day.isCurrent,
                }"
              >
                {{ month.name }}
              </span>

              <span class="task-list__title-separator">|</span>

              <span
                :class="{
                  'task-list__title_bold': day.isCurrent,
                }"
              >
                {{ day.name }} {{ day.number }}
              </span>
            </div>
          </div>
        </template>

        <template #action>
          <BaseButton v-if="!day.isPast" @click="createTask(day.id)" title="Add task">
            Add task
            <template #rightIcon>
              <Plus class="icon icon_sm" />
            </template>
          </BaseButton>
        </template>

        <template #content>
          <draggableComponent
            :list="tasks[day.id].items"
            :group="{ name: 'tasks', pull: null, put: !day.isPast }"
            class="task-list__list"
            handle=".grab-handle"
            item-key="id"
            ghost-class="ghost"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import type { IOnDragChangeEvent } from '@/types';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import draggableComponent from 'vuedraggable';
import { Plus, PanelLeftOpen } from 'lucide-vue-next';
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

<style scoped>
.task-list {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: var(--color-bg-surface);
}

.task-list__sidebar-control {
  width: auto;
}

.task-list__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-list__title_bold {
  font-weight: bold;
}

.task-list__title-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.task-list__dot {
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--rounded-xs);
  background-color: var(--color-bg-success);
}

.task-list__list {
  display: grid;
  gap: 1rem;
}

@media screen and (max-width: 1024px) {
  .task-list__title-inner {
    gap: 0.25rem;
  }
}

@media screen and (max-width: 425px) {
  .task-list__title-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-list__dot {
    display: none;
  }

  .task-list__title-separator {
    display: none;
  }
}
</style>
