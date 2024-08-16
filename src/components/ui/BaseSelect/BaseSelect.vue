<template>
  <select
    :id="id"
    :value="modelValue"
    class="w-full p-2 text-sm border border-slate-300 rounded-md hover:border-slate-400 focus:outline-none focus:border-slate-400 transition-[border-color] select-none"
    @change="changeHandler($event)"
  >
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
