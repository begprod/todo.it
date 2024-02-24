<template>
  <div class="relative flex flex-col grow gap-5 mx-3 lg:mx-0">
    <BaseAccordion
      v-for="month in months"
      :key="month.id"
      :title="month.name"
      :is-open="month.isCurrent"
      additional-classes="sticky top-0 z-40"
    >
      <BaseAccordion
        v-for="day in getDaysByMonthId(month.id)"
        :class="day.isCurrent ? 'current-day' : ''"
        :key="day.id"
        :title="`${day.number} ${day.name}`"
        :is-open="true"
        :is-active="day.isCurrent"
        additional-classes="sticky top-[58px] lg:top-[58px] z-20"
      >
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

        <BaseEmptyListMessage v-if="!tasks[day.id].items.length" message="No tasks for this day" />
      </BaseAccordion>
    </BaseAccordion>
  </div>
</template>

<script setup lang="ts">
import type { IOnDragChangeEvent } from '@/types';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import draggableComponent from 'vuedraggable';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useCalendarStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

const calendarStore = useCalendarStore();
const tasksStore = useTasksStore();
const drag = ref<boolean>(false);
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

.current-day {
  scroll-margin-top: 57px;
}
</style>
