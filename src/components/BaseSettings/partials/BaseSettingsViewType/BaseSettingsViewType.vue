<template>
  <div class="settings-view-controls">
    <BaseButton
      :variant="currentViewType === 'rows' ? 'active' : 'default'"
      @click="setViewType('rows')"
      data-test-id="view-type-rows-button"
    >
      <template #leftIcon>
        <Rows3 class="icon icon_md" />
      </template>
      Rows
    </BaseButton>

    <BaseButton
      :variant="currentViewType === 'columns' ? 'active' : 'default'"
      @click="setViewType('columns')"
      data-test-id="view-type-columns-button"
    >
      <template #leftIcon>
        <Columns3 class="icon icon_md" />
      </template>
      Columns
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Columns3, Rows3 } from 'lucide-vue-next';
import { useCommonStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const { currentViewType } = storeToRefs(commonStore);
const { setViewType } = commonStore;
</script>

<style scoped>
.settings-view-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
