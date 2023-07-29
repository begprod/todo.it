<template>
  <BaseSurface classes="grid gap-5">
    <BaseAccordion
      v-for="month in calendarStore.getMonths"
      :key="month.id"
      :title="month.name"
      :sub-title="month.year"
      :is-open="month.isCurrent"
      :is-active="month.isCurrent"
    >
      <BaseAccordion
        v-for="week in month.weeks"
        :key="week.id"
        :title="`${week.daysInterval.start} – ${week.daysInterval.end}`"
        :is-open="week.isCurrent"
        :is-active="week.isCurrent"
        title-classes="text-xl font-semibold"
      >
        <BaseAccordion
          v-for="day in week.days"
          :key="day.id"
          :title="day.name"
          :is-open="true"
          :is-active="day.isCurrent"
          title-classes="text-lg"
        >
          <BaseButton
            v-if="!day.isPast"
            @click="addTask(day.id)"
          >
            <template #rightIcon>
              Add task
              <v-icon name="hi-plus" />
            </template>
          </BaseButton>
            <BaseTask
              v-for="task in calendarStore.getDayTasksByDayId(day.id)"
              :key="task.id"
              :task="task"
              :title-model-value="task.title"
              :description-model-value="task.description"
            />
          <div
            v-if="calendarStore.getDayTasksByDayId(day.id).length === 0"
            class="flex items-center justify-center h-16 text-lg text-neutral-300"
          >
            <v-icon class="mr-2" name="md-cancel-outlined" />
            No tasks
          </div>
        </BaseAccordion>
      </BaseAccordion>
    </BaseAccordion>
  </BaseSurface>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { onBeforeMount } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import type { ITask } from '@/types';
import BaseSurface from '@/components/ui/BaseSurface.vue';
import BaseAccordion from '@/components/ui/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseTask from '@/components/ui/BaseTask.vue';

const calendarStore = useCalendarStore();

onBeforeMount(() => {
  if (calendarStore.months.length === 0) {
    calendarStore.setMonths();
  }

  if (calendarStore.getIsCurrentWeekIsLast) {
    calendarStore.setNextMonth();
  }
});

const addTask = (dayId: string) => {
  const task: ITask = {
    id: uniqid(),
    title: '',
    description: '',
    dayId: dayId,
    isDone: false,
  };

  calendarStore.addTask(task);
};
</script>
