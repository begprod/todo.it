<template>
  <select :id="id" :value="modelValue" class="select" @change="changeHandler($event)">
    <option selected value="" data-test-id="select-placeholder">{{ placeholder }}</option>
    <option v-for="option in options" :key="option" :value="option" data-test-id="select-option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface IProps {
  id: string;
  options: Array<string>;
  placeholder?: string;
  modelValue?: string | null;
}

withDefaults(defineProps<IProps>(), {
  placeholder: 'Select an option',
});

const emit = defineEmits(['update:modelValue', 'reset:modelValue']);

const changeHandler = (event: Event) => {
  if (!event.target) {
    return;
  }

  emit('update:modelValue', (event.target as HTMLSelectElement).value);
};
</script>

<style scoped>
.select {
  width: 100%;
  padding: 0.5rem;
  font-size: var(--typo-size-sm);
  border: 1px solid var(--color-bg-border);
  border-radius: var(--rounded-md);
  transition: 0.3s ease-in-out;
  transition-property: border-color;
  user-select: none;

  &:hover,
  &:focus {
    border-color: var(--color-bg-border-hover);
    outline: none;
  }
}
</style>
