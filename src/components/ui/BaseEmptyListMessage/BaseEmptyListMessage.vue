<template>
  <div class="empty-message">
    <CaptionsOff class="icon icon_md" />
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

<style scoped>
.empty-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 4rem;
  font-size: var(--typo-size-sm);
  opacity: 0.5;
}
</style>
