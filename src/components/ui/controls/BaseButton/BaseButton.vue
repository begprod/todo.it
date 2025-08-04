<template>
  <button
    class="button"
    :class="classes"
    :type="type"
    :title="title"
    :data-test-id="dataTestId"
    @click="clickHandler"
  >
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
  size?: 'sm';
  dataTestId?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'button',
});

const emits = defineEmits(['click']);

const clickHandler = () => {
  emits('click');
};

const classes = computed(() => ({
  button_size_sm: props.size === 'sm',
}));
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem;
  color: var(--color-typo-primary);
  font-size: var(--typo-size-sm);
  line-height: 1.2;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-bg-border);
  border-radius: var(--rounded-md);
  transition: 0.3s ease-in-out;
  transition-property: background-color;

  &:hover {
    background-color: var(--color-bg-surface-secondary);
  }
}

.button_size_sm {
  padding: 0.13rem;
}
</style>
