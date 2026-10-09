<template>
  <main class="layout">
    <BaseHeader />

    <div class="layout__inner">
      <BaseTaskList />
      <BaseSettings />
    </div>

    <BaseFooter />
  </main>

  <BaseTaskActionsMenu />
  <BaseLabelActionsMenu />
  <BaseTaskLabelMenu />
  <BaseToast :type="status" :message="message" :is-visible="isToastVisible" @click="closeToast" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

const commonStore = useCommonStore();

const { status, message, isToastVisible } = storeToRefs(commonStore);
const { closeToast } = commonStore;
</script>

<style scoped>
.layout {
  margin: 0 auto;
}

.layout__inner {
  display: flex;
}
</style>
