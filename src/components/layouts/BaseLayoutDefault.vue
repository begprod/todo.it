<template>
  <BaseHeader />

  <main class="container min-h-[calc(100vh-120px)] mx-auto p-5 md:pb-10">
    <div class="flex flex-col md:flex-row">
      <slot name="sidebar"></slot>
      <slot name="content"></slot>
    </div>
  </main>

  <BaseFooter />
</template>

<script setup lang="ts">
import BaseHeader from '@/components/layouts/partials/BaseHeader.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter.vue';
</script>
