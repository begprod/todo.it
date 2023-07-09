<template>
  <BaseLayoutDefault>
    <template #sidebar>
      <BaseButton>
        Add to backlog
        <template #rightIcon>
          <v-icon name="bi-plus-square" />
        </template>
      </BaseButton>
      <BaseBacklog />
    </template>
    <template #content>
      <BaseForm />
      <BaseWorkSpace />
    </template>
  </BaseLayoutDefault>
</template>

<script setup lang="ts">
import BaseLayoutDefault from '@/components/layouts/BaseLayoutDefault.vue';
import BaseWorkSpace from '@/components/BaseWorkSpace.vue';
import BaseBacklog from '@/components/ui/BaseBacklog.vue';
import BaseForm from '@/components/ui/BaseForm.vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';
</script>
