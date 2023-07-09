<template>
  <div>
    <div class="mb-8 text-xl font-semibold">
      {{ week.daysInterval.start }} - {{ week.daysInterval.end }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { IWeek } from '@/types';

interface IProps {
  week: IWeek;
}

defineProps<IProps>();
</script>
