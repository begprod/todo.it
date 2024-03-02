<template>
  <div
    v-if="isOpen"
    class="fixed lg:sticky top-0 left-0 shrink-0 mb-0 pb-3 w-60 lg:w-80 max-h-screen min-h-screen bg-neutral-50 border-r border-l shadow-xl lg:shadow-none overflow-y-auto hide-scrollbar z-50"
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
