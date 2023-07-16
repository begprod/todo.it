<template>
  <BaseSurface classes="grid gap-5">
    <BaseAccordion
      v-for="month in calendarStore.getMonths"
      :key="month.id"
      :title="month.name"
      :sub-title="month.year"
      :isOpen="month.isCurrent"
      :show-icon="month.isCurrent"
    >
      <BaseAccordion
        v-for="week in month.weeks"
        :key="week.id"
        :title="`${week.daysInterval.start} – ${week.daysInterval.end}`"
        :isOpen="week.isCurrent"
        :show-icon="week.isCurrent"
        title-classes="text-xl font-semibold"
      >
        <BaseAccordion
          v-for="day in week.days"
          :key="day.id"
          :title="day.name"
          :isOpen="true"
          :show-icon="day.isCurrent"
          title-classes="text-lg"
        >
          <div
            v-if="!calendarStore.getTodoByDayId(day.id)"
            class="flex items-center justify-center h-16 text-lg text-neutral-300"
          >
            <v-icon class="mr-2" name="md-cancel-outlined" />
            No tasks
          </div>
          <BaseButton v-if="!week.isPast">
            <template #rightIcon>
              Add task
              <v-icon name="hi-plus" />
            </template>
          </BaseButton>
        </BaseAccordion>
      </BaseAccordion>
    </BaseAccordion>
  </BaseSurface>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import BaseSurface from '@/components/ui/BaseSurface.vue';
import BaseAccordion from '@/components/ui/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

const calendarStore = useCalendarStore();

onBeforeMount(() => {
  if (calendarStore.months.length === 0) {
    calendarStore.setMonths();
  }

  if (calendarStore.getIsCurrentWeekIsLast) {
    calendarStore.setNextMonth();
  }
});
</script>
