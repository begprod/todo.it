<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <slot name="logo" />
      <slot name="nav" />
    </div>

    <div class="sidebar__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 320px;
  min-height: 100%;
  padding: 3rem 2rem 1rem 2rem;
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}
</style>
