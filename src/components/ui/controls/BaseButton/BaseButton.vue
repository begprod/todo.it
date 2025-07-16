<template>
  <button
    class="button"
    :type="type"
    :title="title"
    :data-test-id="dataTestId"
    @click="clickHandler"
  >
    <slot name="leftIcon"></slot>
    <slot></slot>
    <slot name="rightIcon"></slot>
  </button>
</template>

<script setup lang="ts">
interface IProps {
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  dataTestId?: string;
}

withDefaults(defineProps<IProps>(), {
  type: 'button',
});

const emits = defineEmits(['click']);

const clickHandler = () => {
  emits('click');
};
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
