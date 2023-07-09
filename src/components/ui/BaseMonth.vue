<template>
  <div class="mb-6 text-5xl font-semibold">
    {{ name }}
  </div>

  <BaseWeek
    v-for="week in weeks"
    :key="week.id"
    :week="week"
  >
    <BaseDay
      v-for="day in week.days"
      :key="day.id"
      :day="day"
    >
      <!-- <BaseTodo
        v-for="todo in day.todos"
        :key="todo.id"
        :todo="todo"
      /> -->
    </BaseDay>
  </BaseWeek>
</template>

<script setup lang="ts">
import type { IWeek } from '@/types';
import BaseWeek from '@/components/ui/BaseWeek.vue';
import BaseDay from '@/components/ui/BaseDay.vue';
// import BaseTodo from '@/components/ui/BaseTodo.vue';

interface IProps {
  name: string;
  weeks: Array<IWeek>;
}

defineProps<IProps>();
</script>
