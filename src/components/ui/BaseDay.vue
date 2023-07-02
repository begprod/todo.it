<template>
  <div class="mb-4 pl-6">
    <h4>{{ day.name }}</h4>

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { IDay } from '@/types';

interface IProps {
  day: IDay;
}

defineProps<IProps>();
</script>
