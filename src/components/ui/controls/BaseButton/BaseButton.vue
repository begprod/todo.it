<template>
  <button
    class="flex items-center justify-center w-full py-2 lg:py-2 px-1 lg:px-4 text-sm lg:text-base bg-white border border-neutral-200 text-neutral-600 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
    :type="type"
    :title="title"
    @click="clickHandler"
  >
    <slot name="leftIcon"></slot>
    <slot></slot>
    <slot name="rightIcon"></slot>
  </button>
</template>

<script setup lang="ts">
interface IProps {
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

withDefaults(defineProps<IProps>(), {
  type: 'button',
});

const emits = defineEmits(['click']);

const clickHandler = () => {
  emits('click');
};
</script>
