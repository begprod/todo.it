<template>
  <div
    v-if="isOpen"
    class="sticky top-0 shrink-0 lg:mr-4 mb-0 pb-3 bg-neutral-50 lg:border-r border-slate-300 max-h-60 lg:max-h-screen lg:min-h-screen overflow-y-auto hide-scrollbar"
  >
    <div class="flex flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  isOpen?: boolean;
}

withDefaults(defineProps<IProps>(), {
  isOpen: false,
});
</script>
