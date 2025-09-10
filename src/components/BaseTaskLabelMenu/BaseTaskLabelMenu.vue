<template>
  <BasePopup :is-visible="isTaskLabelMenuOpen" @close="closeTaskLabelMenu">
    <BaseFilterSearch
      id="labels-search-input"
      placeholder="Start typing label name"
      :search-items="labelsList"
      @item-action="addLabel"
    />

    <div v-if="currentEditingTask?.labels?.length" class="labels-list" data-test-id="labels-list">
      <BaseLabel
        v-for="label in currentEditingTask?.labels"
        :key="label.id"
        :title="label.name"
        :scope-title="'scopeTitle' in label ? label.scopeTitle : null"
        :color="label.color"
        :is-deletable="true"
        @remove-label="removeLabel(label)"
      />
    </div>
  </BasePopup>
</template>

<script setup lang="ts">
import type { ILabel } from '@/types';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCommonStore, useTasksStore, useLabelsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseFilterSearch from '@/components/BaseFilterSearch/BaseFilterSearch.vue';
import BaseLabel from '@/components/ui/BaseLabel/BaseLabel.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const labelsStore = useLabelsStore();
const { closeTaskLabelMenu } = commonStore;
const { addLabelToTask, removeLabelFromTask } = tasksStore;
const { currentEditingTask, isTaskLabelMenuOpen } = storeToRefs(commonStore);
const { getGroupedLabels } = storeToRefs(labelsStore);
const labelsList = computed(() => {
  const filterExistLabels = getGroupedLabels.value.filter((label: ILabel) => {
    if (!currentEditingTask.value) {
      return true;
    }

    return !currentEditingTask.value.labels.find((taskLabel: ILabel) => taskLabel.id === label.id);
  });

  return filterExistLabels.map((label) => ({
    ...label,
    searchString: `${label.name} ${label.scopeTitle || ''}`,
  }));
});

const addLabel = (label: ILabel) => {
  if (!currentEditingTask.value) {
    return;
  }

  addLabelToTask(currentEditingTask.value, label);
};

const removeLabel = (label: ILabel) => {
  if (!currentEditingTask.value) {
    return;
  }

  removeLabelFromTask(currentEditingTask.value, label);
};
</script>

<style scoped>
.labels-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 1.25rem 1.25rem 1.25rem;
}
</style>
