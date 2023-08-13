<template>
  <BaseHeader />
  <main class="font-body py-20">
    <div class="flex">
      <div class="sticky top-20 flex flex-col shrink-0 basis-3/12 max-h-screen overflow-x-scroll p-5">
        <slot name="sidebar"></slot>
      </div>
      <div class="flex flex-col grow p-5">
        <div class="grid gap-5">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import BaseHeader from '@/components/layouts/partials/BaseHeader.vue';
</script>
