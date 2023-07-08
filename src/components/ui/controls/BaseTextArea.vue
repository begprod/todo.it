<template>
  <div>
    <label
      :for="id"
      class="sr-only"
    >
      {{ label }}
    </label>
    <textarea
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :cols="cols"
      :rows="rows"
      :value="modelValue"
      @input="onInput"
      class="w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-700 shadow-sm shadow-gray-200 hover:shadow-lg focus:shadow-2xl focus:outline-none focus:border-blue-500 transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  placeholder: string;
  modelValue: string;
  required?: boolean;
  cols?: string;
  rows?: string;
}

defineProps<Props>();

const emits = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>
