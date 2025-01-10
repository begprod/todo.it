<template>
  <div class="flex items-center justify-center h-16 text-sm text-neutral-500">
    <CaptionsOff class="mr-2 w-5 h-5" />
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { CaptionsOff } from 'lucide-vue-next';

interface IProps {
  message: string;
}

defineProps<IProps>();
</script>
