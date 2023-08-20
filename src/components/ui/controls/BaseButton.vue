<template>
  <button
    :type="type"
    :title="title"
    class="flex items-center justify-center w-full py-2 lg:py-2 px-1 lg:px-4 text-sm lg:text-base bg-white border border-neutral-200 text-neutral-600 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <slot name="leftIcon"></slot>
    <slot></slot>
    <slot name="rightIcon"></slot>
  </button>
</template>

<script setup lang="ts">
interface IProps {
  type: 'button' | 'submit' | 'reset';
  title?: string;
}

defineProps<IProps>();
</script>
