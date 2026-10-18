<template>
  <div class="settings-backup-controls">
    <BaseButton
      @click="exportDataFromLocalStorage(['todo:scopes', 'todo:labels', 'todo.it:tasks'])"
      data-test-id="export-data-button"
    >
      <template #leftIcon>
        <FileUp class="icon icon_md" />
      </template>
      Export
    </BaseButton>
    <BaseButton @click="importDataHandler" data-test-id="import-data-button">
      <template #leftIcon>
        <FileDown class="icon icon_md" />
      </template>
      Import
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { FileDown, FileUp } from 'lucide-vue-next';
import { useCommonStore } from '@/stores';
import { exportDataFromLocalStorage, importDataToLocalStorage } from '@/helpers';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const { setMessage, setStatus, showToast } = commonStore;

const importDataHandler = async () => {
  await importDataToLocalStorage()
    .then(() => {
      location.reload();
    })
    .catch(() => {
      setMessage('Something went wrong while importing data');
      setStatus('error');
      showToast();
    });
};
</script>

<style scoped>
.settings-backup-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
