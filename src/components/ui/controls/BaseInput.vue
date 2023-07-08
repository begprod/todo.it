<template>
  <div>
    <label
      :for="id"
      class="sr-only"
    >
    {{ label }}
  </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :value="modelValue"
      @input="onInput"
      class="w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-700 shadow-sm shadow-gray-200 hover:shadow-lg focus:shadow-2xl focus:outline-none focus:border-blue-500 transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  modelValue: string;
  required?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
}

defineProps<Props>();

const emits = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>
