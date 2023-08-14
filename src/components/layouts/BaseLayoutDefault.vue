<template>
  <BaseHeader />

  <main class="max-w-base mx-auto pt-28 px-5 pb-10">
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
