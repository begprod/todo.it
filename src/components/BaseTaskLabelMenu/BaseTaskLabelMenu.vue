<template>
  <BasePopup :is-visible="isTaskLabelMenuOpen" @close="closeTaskLabelMenu">
    <BaseFilterSearch
      id="labels-search-input"
      placeholder="Start typing label name"
      :search-items="labelsList"
      @item-action="addLabel"
    />
  </BasePopup>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommonStore, useTasksStore, useLabelsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseFilterSearch from '@/components/BaseFilterSearch/BaseFilterSearch.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const labelsStore = useLabelsStore();
const { closeTaskLabelMenu } = commonStore;
const { addLabelToTask } = tasksStore;
const { currentEditingTask, isTaskLabelMenuOpen } = storeToRefs(commonStore);
const { getAllLabels } = storeToRefs(labelsStore);
const labelsList = computed(() => {
  const filteredLabels = getAllLabels.value.filter(
    (label) => label.id !== currentEditingTask.value?.id,
  );

  return filteredLabels.map((label) => ({
    ...label,
    searchString: `${label.name} ${label.scopeTitle || ''}`,
  }));
});

const addLabel = (label: IScope | ILabel) => {
  if (!currentEditingTask.value) {
    return;
  }

  addLabelToTask(currentEditingTask.value, label);
};
</script>
