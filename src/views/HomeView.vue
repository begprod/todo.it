<template>
  <BaseLayoutDefault>
    <template #sidebar>
      <BaseSidebar />
    </template>
    <template #content>
      <BaseWorkSpace />
    </template>
  </BaseLayoutDefault>
</template>

<script setup lang="ts">
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar.vue';
import BaseWorkSpace from '@/components/BaseWorkSpace.vue';
</script>
