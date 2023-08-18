<template>
  <BaseHeader />

  <main class="container min-h-[calc(100vh-120px)] mx-auto pt-5 px-5 md:px-0 pb-5 md:pb-10">
    <div class="flex">
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
