<template>
  <div class="grow">
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
          :id="day.isCurrent ? 'current-day' : ''"
          :key="day.id"
          :title="day.name"
          :is-open="true"
          :is-active="day.isCurrent"
          title-classes="text-lg"
        >
          <BaseButton v-if="!day.isPast" @click="addTask(day.id)" type="button">
            Add task
            <template #rightIcon>
              <div class="ml-4">
                <v-icon name="hi-plus" />
              </div>
            </template>
          </BaseButton>

          <draggableComponent
            :list="calendarStore.getDayTasksByDayId(day.id)"
            :group="{ name: 'tasks', pull: null, put: !day.isPast }"
            class="grid gap-5"
            handle=".grab-handle"
            item-key="id"
            ghost-class="opacity-50"
            drag-class="opacity-50"
            @start="drag = true"
            @end="drag = false"
            @change="onDragChange($event, day.id)"
            :component-data="{
              tag: 'div',
              type: 'transition',
              name: !drag ? 'flip-list' : null,
            }"
          >
            <template #item="{ element }">
              <BaseTask :task="element" />
            </template>
          </draggableComponent>

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
  </div>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import draggableComponent from 'vuedraggable';
import { ref, onBeforeMount, onMounted } from 'vue';
import { useCalendarStore } from '@/stores';
import type { ITask, IOnDragChangeEvent } from '@/types';
import BaseAccordion from '@/components/ui/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
import BaseTask from '@/components/ui/BaseTask.vue';

const calendarStore = useCalendarStore();
const drag = ref<boolean>(false);
const newDayId = ref<string>('');

onBeforeMount(() => {
  if (calendarStore.months.length === 0) {
    calendarStore.setMonths();
  }

  if (Object.keys(calendarStore.tasksByDay).length === 0) {
    calendarStore.createTasksByDayStructure();
  }

  if (calendarStore.getIsCurrentWeekIsLast) {
    calendarStore.setNextMonth();
  }
});

onMounted(() => {
  const currentDayElement = document.getElementById('current-day');
  const offsetFromTopOfElement = 120;

  if (currentDayElement) {
    window.scrollTo({
      top: currentDayElement.offsetTop - offsetFromTopOfElement,
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
