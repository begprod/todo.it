<template>
  <main class="mx-auto">
    <div class="flex flex-col lg:flex-row">
      <BaseBacklog />
      <BaseTaskList />
      <BaseSettings />
    </div>
  </main>

  <BaseTaskActionsMenu />
  <BaseToast :type="status" :message="message" :is-visible="isToastVisible" @click="closeToast" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

const commonStore = useCommonStore();

const { status, message, isToastVisible } = storeToRefs(commonStore);
const { closeToast } = commonStore;
</script>
