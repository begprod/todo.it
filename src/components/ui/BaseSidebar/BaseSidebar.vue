<template>
  <div v-if="isOpen" class="sidebar">
    <div class="sidebar__inner hide-scrollbar">
      <slot name="main"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  isOpen?: boolean;
  side?: 'left' | 'right';
}

withDefaults(defineProps<IProps>(), {
  isOpen: false,
});
</script>

<style scoped>
.sidebar {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  left: 0;
  width: 350px;
  height: 100dvh;
  background-color: var(--color-bg-surface-trinary);
  border-left: 1px solid var(--color-bg-border);
  border-right: 1px solid var(--color-bg-border);
  overflow-y: auto;
  z-index: 50;
}

.sidebar__inner {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100dvh;
}

@media screen and (max-width: 1024px) {
  .sidebar {
    position: fixed;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  }
}

@media screen and (max-width: 425px) {
  .sidebar {
    width: 320px;
  }
}
</style>
