<template>
  <div class="relative flex flex-col grow gap-5">
    <BaseAccordion
      v-for="month in calendarStore.getMonths"
      :key="month.id"
      :title="month.name"
      :sub-title="month.year"
      :is-open="month.isCurrent"
      :is-active="month.isCurrent"
      additional-classes="sticky top-[72px] lg:top-20 z-40"
    >
      <BaseAccordion
        v-for="week in month.weeks"
        :key="week.id"
        :title="`${week.daysInterval.start} – ${week.daysInterval.end}`"
        :is-open="week.isCurrent"
        :is-active="week.isCurrent"
        additional-classes="sticky top-28 min-h-[50px] lg:min-h-[initial] lg:top-36 z-30"
      >
        <BaseAccordion
          v-for="day in week.days"
          :id="day.isCurrent ? 'current-day' : ''"
          :key="day.id"
          :title="day.name"
          :is-open="true"
          :is-active="day.isCurrent"
          additional-classes="sticky top-40 lg:top-52 z-20"
        >
          <BaseButton v-if="!day.isPast" @click="addTask(day.id)">
            Add task
            <template #rightIcon>
              <div class="ml-4">
                <v-icon name="hi-plus" />
              </div>
            </template>
          </BaseButton>

          <draggableComponent
            id="dayArea"
            :list="calendarStore.getDayTasksByDayId(day.id)"
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

          <div
            v-if="calendarStore.getDayTasksByDayId(day.id).length === 0"
            class="flex items-center justify-center h-16 text-sm lg:text-lg text-neutral-200"
          >
            <v-icon class="mr-2" name="md-cancel-outlined" />
            No tasks for this day
          </div>
        </BaseAccordion>
      </BaseAccordion>
    </BaseAccordion>
  </div>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import draggableComponent from 'vuedraggable';
import { ref, onMounted } from 'vue';
import { useCalendarStore } from '@/stores';
import type { ITask, IOnDragChangeEvent } from '@/types';
import BaseAccordion from '@/components/ui/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseTask from '@/components/ui/BaseTask.vue';

const calendarStore = useCalendarStore();
const drag = ref<boolean>(false);

onMounted(() => {
  const currentDayElement = document.getElementById('current-day');

  if (currentDayElement) {
    const numberOfAccordions = 3;
    const elementY = currentDayElement.getBoundingClientRect().top + window.scrollY;
    const offset = currentDayElement.getBoundingClientRect().height * numberOfAccordions;

    window.scroll({
      top: elementY - offset,
      behavior: 'smooth',
    });
  }
});

const onDragChange = (event: IOnDragChangeEvent, dayId: string) => {
  newDayId.value = dayId;

  if (event.added) {
    const task = event.added.element;

    calendarStore.updateTask({
      ...task,
      dayId: dayId,
    });
  }
};

const addTask = (dayId: string) => {
  const task: ITask = {
    id: uniqid(),
    title: '',
    description: '',
    dayId: dayId,
    isDone: false,
  };

  calendarStore.addTaskToDay(task);
};
</script>

<style scoped lang="scss">
.drag {
  position: relative;
  opacity: 50;
  z-index: 9999;
}
</style>
