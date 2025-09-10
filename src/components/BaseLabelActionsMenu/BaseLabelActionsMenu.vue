<template>
  <BasePopup :is-visible="isLabelActionMenuOpen" @close="closeLabelActionMenu">
    <div class="label-actions-menu">
      <div class="label-actions-menu__inner">
        <div
          class="label-actions-menu__color"
          :style="{ backgroundColor: currentEditingLabel?.color }"
          data-test-id="label-list-item-color"
        />
        <div class="label-actions-menu__description">
          <span
            v-if="currentEditingLabel && 'scopeTitle' in currentEditingLabel"
            class="label-actions-menu__scope"
            :title="currentEditingLabel?.scopeTitle ? currentEditingLabel?.scopeTitle : ''"
          >
            {{ currentEditingLabel?.scopeTitle }}
          </span>
          <span class="label-actions-menu__title" :title="currentEditingLabel?.name">
            {{ currentEditingLabel?.name }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <BaseButton
        v-if="!showDeleteConfirmation"
        variant="action"
        color="alert"
        title="Delete"
        @click="showDeleteConfirmation = !showDeleteConfirmation"
      >
        <template #leftIcon>
          <Trash2 class="icon icon_lg" />
        </template>
        Delete
      </BaseButton>
      <BaseButton
        v-if="showDeleteConfirmation"
        variant="action"
        color="secondary"
        background="alert"
        title="Confirm deletion"
        @click="remove()"
      >
        <template #leftIcon>
          <Trash2 class="icon icon_lg" />
        </template>
        Confirm deletion
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Trash2 } from 'lucide-vue-next';
import { useCommonStore, useLabelsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { currentEditingLabel, isLabelActionMenuOpen } = storeToRefs(commonStore);
const { closeLabelActionMenu } = commonStore;
const { deleteItem } = labelsStore;
const showDeleteConfirmation = ref<boolean>(false);

watch(isLabelActionMenuOpen, (newValue: boolean) => {
  if (newValue) {
    showDeleteConfirmation.value = false;
  }
});

const remove = () => {
  if (!isLabelActionMenuOpen.value || !currentEditingLabel.value) {
    return;
  }

  deleteItem(currentEditingLabel.value.id);
  closeLabelActionMenu();
};

defineExpose({
  remove,
});
</script>

<style scoped>
.label-actions-menu {
  padding: 1.25rem;
}

.label-actions-menu__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.label-actions-menu__color {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--rounded-full);
}

.label-actions-menu__description {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.label-actions-menu__scope {
  max-width: 100%;
  color: var(--color-typo-trinary);
  font-size: var(--typo-size-lg);
  text-overflow: ellipsis;
  overflow: hidden;
}

.label-actions-menu__title {
  max-width: 100%;
  font-size: var(--typo-size-lg);
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
