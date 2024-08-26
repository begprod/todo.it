<template>
  <div class="relative w-full">
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      :class="isError ? '!border-red-500 !focus:border-red-500' : ''"
      :data-test-id="dataTestId"
      @input="inputHandler"
      @blur="blurHandler"
      class="w-full p-2 text-sm border border-slate-300 rounded-md hover:border-slate-400 focus:outline-none focus:border-slate-400 transition-[border-color] select-none"
    />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  modelValue: string | number;
  id: string;
  type: string;
  placeholder: string;
  dataTestId?: string;
  autocomplete?: string;
  isError?: boolean;
}

defineProps<IProps>();

const emit = defineEmits(['update:modelValue', 'onBlur']);

const inputHandler = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const blurHandler = () => {
  emit('onBlur');
};
</script>
