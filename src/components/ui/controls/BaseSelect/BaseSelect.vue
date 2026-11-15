<template>
  <select :id="id" :value="modelValue" class="select" @change="changeHandler($event)">
    <option selected value="" data-test-id="select-placeholder">{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="getOptionValue(option)"
      :value="getOptionValue(option)"
      data-test-id="select-option"
    >
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface IBaseSelectOption {
  value: string;
  label: string;
}

interface IProps {
  id: string;
  options: Array<string | IBaseSelectOption>;
  placeholder?: string;
  modelValue?: string | null;
}

withDefaults(defineProps<IProps>(), {
  placeholder: 'Select an option',
});

const emit = defineEmits(['update:modelValue', 'reset:modelValue']);

const getOptionValue = (option: string | IBaseSelectOption) =>
  typeof option === 'string' ? option : option.value;
const getOptionLabel = (option: string | IBaseSelectOption) =>
  typeof option === 'string' ? option : option.label;

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
  background-color: var(--color-bg-surface);
  color: var(--color-typo-primary);
  border: 1px solid var(--color-bg-border);
  border-radius: var(--rounded-lg);
  transition: 0.3s ease-in-out;
  transition-property: border-color;
  user-select: none;

  &:hover,
  &:focus {
    border-color: var(--color-bg-border-hover);
    outline: none;
  }
}

.select option {
  background-color: var(--color-bg-surface);
  color: var(--color-typo-primary);
}
</style>
