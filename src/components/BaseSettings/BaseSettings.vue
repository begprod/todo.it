<template>
  <BaseSidebar :is-open="isSettingsOpen">
    <template #main> Settings </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';

const commonStore = useCommonStore();
const { isSettingsOpen } = storeToRefs(commonStore);
</script>
