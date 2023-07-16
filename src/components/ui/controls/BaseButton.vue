<template>
  <button
    :type="type"
    class="w-full py-3 px-4 border border-neutral-200 text-neutral-600 rounded-xl shadow-sm bg-white hover:shadow-lg transition-all duration-300"
  >
    <slot name="leftIcon"></slot>
    <slot></slot>
    <slot name="rightIcon"></slot>
  </button>
</template>

<script setup lang="ts">
interface IProps {
  type?: 'button' | 'submit' | 'reset';
}

defineProps<IProps>();
</script>
