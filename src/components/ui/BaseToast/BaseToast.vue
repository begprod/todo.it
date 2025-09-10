<template>
  <div class="toast">
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="toast__inner"
        :class="classObject"
        @click="onClick"
        data-test-id="toast"
      >
        <div v-if="props.type === 'success'" class="toast__icon" data-test-id="toast-success-icon">
          <ThumbsUp class="icon icon_md" />
        </div>
        <div v-if="props.type === 'error'" class="toast__icon" data-test-id="toast-error-icon">
          <TriangleAlert class="icon icon_md" />
        </div>

        <div class="toast__message" data-test-id="toast-message">
          {{ message }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ThumbsUp, TriangleAlert } from 'lucide-vue-next';

interface IProps {
  type?: 'default' | 'success' | 'error';
  message: string;
  isVisible: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(['click']);

const classObject = computed(() => {
  switch (props.type) {
    case 'success':
      return 'toast_success';
    case 'error':
      return 'toast_error';
    default:
      return 'toast_default';
  }
});

const onClick = () => {
  emit('click');
};
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 2rem;
  width: 272px;
  transform: translateX(-50%);
  z-index: 1000;
}

.toast_success {
  color: var(--color-typo-success);

  .toast__icon {
    color: var(--color-typo-success);
    border: 1px solid var(--color-bg-success);
  }
}

.toast_error {
  color: var(--color-typo-alert);

  .toast__icon {
    color: var(--color-typo-alert);
    border: 1px solid var(--color-bg-alert);
  }
}

.toast__inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 320px;
  padding: 1rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-md);
  box-shadow: 0 2px 3px 0 var(--color-bg-surface-secondary);
  transition: all 0.3s ease-in-out;
  will-change: auto;

  &:hover {
    box-shadow:
      0 10px 15px -3px var(--color-bg-surface-secondary),
      0 4px 6px -4px var(--color-bg-surface-secondary);
  }
}

.toast__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: var(--rounded-md);
}

.toast__message {
  display: flex;
  flex-direction: column;
  font-size: var(--typo-size-sm);
}
</style>
