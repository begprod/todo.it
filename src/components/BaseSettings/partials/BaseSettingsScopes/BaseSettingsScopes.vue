<template>
  <Teleport defer to="#settings-actions">
    <BaseButton title="Add scope" @click="openScopeForm()">
      <Plus />
    </BaseButton>
  </Teleport>

  <template v-if="getSortedScopes.length > 0">
    <BaseLabelList
      title="Scopes"
      :labels="getSortedScopes"
      :show-label-action-menu="true"
      @open-action-menu="showLabelActionMenu"
    />
  </template>
</template>

<script setup lang="ts">
import type { ILabel } from '@/types';
import { Plus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { usePopupsStore, useLabelsStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

const popupsStore = usePopupsStore();
const labelsStore = useLabelsStore();
const { setCurrentEditingLabel, openLabelActionMenu, openScopeForm } = popupsStore;
const { getSortedScopes } = storeToRefs(labelsStore);

const showLabelActionMenu = (label: ILabel) => {
  setCurrentEditingLabel(label);

  openLabelActionMenu();
};
</script>
