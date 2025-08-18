<template>
  <div v-if="isOpen" class="sidebar" :class="classes">
    <div class="sidebar__inner hide-scrollbar">
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

<style scoped>
.sidebar {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  width: 310px;
  height: 100dvh;
  background-color: var(--color-bg-surface-trinary);
  border-left: 1px solid var(--color-bg-border);
  border-right: 1px solid var(--color-bg-border);
  overflow-y: auto;
  z-index: 50;
}

.sidebar_left {
  left: 0;
}

.sidebar_right {
  right: 0;
}

.sidebar__inner {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100dvh;
}

@media screen and (max-width: 1024px) {
  .sidebar {
    position: fixed;
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
}
</style>
