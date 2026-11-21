<template>
  <div class="app">
    <RouterView />
  </div>
  <BaseMobileStub />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BaseMobileStub from '@/components/BaseMobileStub/BaseMobileStub.vue';
</script>

<style scoped>
@media screen and (max-width: 1023.98px) {
  .app {
    display: none;
  }
}
</style>
