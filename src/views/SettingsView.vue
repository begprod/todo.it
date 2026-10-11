<template>
  <BaseLayout>
    <BaseSettings />
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
</script>

<style scoped>
.settings-view {
  position: relative;
  min-height: 100dvh;
  padding: 1rem;
  overflow-y: auto;
}
</style>
