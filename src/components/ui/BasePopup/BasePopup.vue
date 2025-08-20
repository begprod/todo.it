<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="popup"
      @keydown.esc="closeTaskActionMenu"
      data-test-id="popup-container"
    >
      <div class="popup__inner" data-test-id="popup-content">
        <slot></slot>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="isVisible" class="paranja" @click="$emit('close')" data-testid="popup-backdrop" />
  </Transition>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores';

interface IProps {
  isVisible?: boolean;
}

withDefaults(defineProps<IProps>(), {
  isVisible: false,
});

defineEmits(['close']);

const commonStore = useCommonStore();
const { closeTaskActionMenu } = commonStore;

defineExpose({
  closeTaskActionMenu,
});
</script>

<style scoped>
.popup {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9999;
}

.popup__inner {
  padding: 0.5rem;
  width: 100%;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-md);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
