<template>
  <BaseHeader />

  <div class="settings-view">
    <BaseSettings />
  </div>

  <BaseLabelActionsMenu />
  <BaseToast :type="status" :message="message" :is-visible="isToastVisible" @click="closeToast" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

const commonStore = useCommonStore();

const { status, message, isToastVisible } = storeToRefs(commonStore);
const { closeToast } = commonStore;
</script>

<style scoped>
.settings-view {
  position: relative;
  min-height: 100dvh;
  padding: 1rem;
  overflow-y: auto;
}
</style>
