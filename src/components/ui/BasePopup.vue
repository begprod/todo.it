<template>
  <div
    v-if="isVisible"
    class="fixed top-0 right-0 bottom-0 left-0 w-full flex items-end lg:items-center p-0 lg:pb-8 justify-center z-[9999]"
  >
    <div
      class="min-w-full lg:min-w-[500px] p-2 text-neutral-600 rounded-xl rounded-bl-none lg:rounded-bl-xl rounded-br-none lg:rounded-br-xl bg-white z-50"
    >
      <slot></slot>
    </div>

    <div
      class="fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-80 z-40"
      @click.stop="closeHandler"
    />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  isVisible?: boolean;
}

withDefaults(defineProps<IProps>(), {
  isVisible: false,
});

const emits = defineEmits(['close']);

const closeHandler = () => {
  emits('close');
};
</script>
