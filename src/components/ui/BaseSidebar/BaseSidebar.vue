<template>
  <div
    v-if="isOpen"
    class="fixed lg:sticky top-0 shrink-0 mb-0 w-72 lg:w-80 max-h-screen min-h-screen bg-neutral-50 border-r border-l shadow-xl lg:shadow-none overflow-y-auto hide-scrollbar z-50"
    :class="classes"
  >
    <div class="grid grid-rows-[auto_1fr_auto] h-lvh">
      <slot name="main"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  isOpen?: boolean;
  side?: 'left' | 'right';
}

const props = withDefaults(defineProps<IProps>(), {
  isOpen: false,
  side: 'left',
});

const classes = computed(() => ({
  'left-0': props.side === 'left',
  'right-0': props.side === 'right',
}));
</script>
