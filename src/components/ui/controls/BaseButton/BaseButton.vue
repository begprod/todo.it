<template>
  <button
    class="flex items-center justify-center w-full p-2 text-sm leading-3 bg-white border border-neutral-300 text-neutral-600 rounded-md hover:bg-slate-50 transition-all duration-300"
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
