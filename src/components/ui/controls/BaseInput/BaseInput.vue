<template>
  <div class="flex items-center relative w-full">
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      :class="classes"
      :data-test-id="dataTestId"
      @input="inputHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      class="w-full p-2 pl- text-sm border border-slate-300 rounded-md hover:border-slate-400 focus:outline-none focus:border-slate-400 transition-[border-color] select-none"
    />

    <div class="absolute top-1/2 -translate-y-1/2 left-[0.4rem]">
      <slot name="icon-left" />
    </div>

    <div class="absolute top-1/2 -translate-y-1/2 right-[0.4rem]">
      <slot name="icon-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

interface IProps {
  modelValue: string | number;
  id: string;
  type: string;
  placeholder: string;
  dataTestId?: string;
  autocomplete?: string;
  isError?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue', 'onFocus', 'onBlur']);
const slots = useSlots();
const hasIconLeft = computed(() => !!slots['icon-left']);
const hasIconRight = computed(() => !!slots['icon-right']);

const inputHandler = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const focusHandler = () => {
  emit('onFocus');
};

const blurHandler = () => {
  emit('onBlur');
};

const classes = computed(() => {
  return {
    '!border-red-500 !focus:border-red-500': props.isError,
    'pl-9': hasIconLeft.value,
    'pr-9': hasIconRight.value,
  };
});
</script>
