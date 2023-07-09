<template>
  <button
    :type="type"
    class="w-full py-3 px-4 text-white rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300"
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
