<template>
  <BaseLayoutDefault>
    <template #sidebar>
      <BaseBacklog />
    </template>
    <template #content>
      <BaseForm />
      <BaseMonth />
    </template>
  </BaseLayoutDefault>
</template>

<script setup lang="ts">
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseBacklog from '@/components/ui/BaseBacklog.vue';
import BaseForm from '@/components/ui/BaseForm.vue';
import BaseMonth from '@/components/ui/BaseMonth.vue';
</script>
