<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="popup" data-test-id="popup-container">
      <div class="popup__inner" data-test-id="popup-content">
        <slot></slot>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="isVisible" class="paranja" @click="emit('close')" data-testid="popup-backdrop" />
  </Transition>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

interface IProps {
  isVisible?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isVisible: false,
});

const emit = defineEmits(['close']);

useEventListener(document, 'keydown', (event) => {
  if (!props.isVisible || event.key !== 'Escape') {
    return;
  }

  emit('close');
});
</script>

<style scoped>
.popup {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}

.popup__inner {
  padding: 0.5rem;
  width: 100%;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-lg);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
