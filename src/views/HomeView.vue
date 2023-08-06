<template>
  <BaseLayoutDefault>
    <template #sidebar>
      <BaseButton
        class="sticky top-0 z-20"
        @click="addTaskToBacklog"
      >
        Add task to backlog
        <template #rightIcon>
          <v-icon name="hi-plus" />
        </template>
      </BaseButton>
      <BaseBacklog />
    </template>
    <template #content>
      <BaseWorkSpace />
    </template>
  </BaseLayoutDefault>
</template>

<script setup lang="ts">
import uniqid from 'uniqid';
import { useCalendarStore } from '@/stores/calendar';
import type { ITask } from '@/types';
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseWorkSpace from '@/components/BaseWorkSpace.vue';
import BaseBacklog from '@/components/ui/BaseBacklog.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

const calendarStore = useCalendarStore();

const addTaskToBacklog = () => {
  const task: ITask = {
    id: uniqid(),
    title: '',
    description: '',
    dayId: null,
    isDone: false,
  };

  calendarStore.addTaskToBacklog(task);
};
</script>
