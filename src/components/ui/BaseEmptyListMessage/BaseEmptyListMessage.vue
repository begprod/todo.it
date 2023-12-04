<template>
  <div class="flex items-center justify-center h-16 text-sm text-neutral-500">
    <XCircleIcon class="mr-2 w-6 h-6" />
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline';

interface IProps {
  message: string;
}

defineProps<IProps>();
</script>
