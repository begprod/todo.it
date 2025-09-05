<template>
  <button class="button" :class="classes" :type="type" :title="title" @click="clickHandler">
    <div v-if="$slots.leftIcon" class="button__icon-left">
      <slot name="leftIcon"></slot>
    </div>

    <slot></slot>

    <div v-if="$slots.rightIcon" class="button__icon-right">
      <slot name="rightIcon"></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  variant?: 'default' | 'action';
  color?: 'default' | 'secondary' | 'success' | 'alert';
  background?: 'default' | 'alert';
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'default',
  type: 'button',
  size: 'sm',
  color: 'default',
  background: 'default',
});

const emits = defineEmits(['click']);

const clickHandler = () => {
  emits('click');
};

const classes = computed(() => [
  `button_variant_${props.variant}`,
  `button_color_${props.color}`,
  `button_background_${props.background}`,
]);
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  color: var(--color-typo-primary);
  font-size: var(--typo-size-sm);
  line-height: 1.2;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-bg-border);
  border-radius: var(--rounded-md);
  white-space: nowrap;
  transition: 0.3s ease-in-out;
  transition-property: background-color, opacity;
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-surface-secondary);
  }

  svg {
    user-select: none;
    pointer-events: none;
  }
}

.button__icon-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button_variant_action {
  justify-content: start;
  padding: 1.25rem;
  border: none;
}

.button_color_success {
  color: var(--color-typo-success);
}

.button_color_alert {
  color: var(--color-typo-alert);
}

.button_color_secondary {
  color: var(--color-typo-secondary);
}

.button_background_alert {
  opacity: 0.9;
  background-color: var(--color-bg-alert);

  &:hover {
    background-color: var(--color-bg-alert);
    opacity: 1;
  }
}
</style>
