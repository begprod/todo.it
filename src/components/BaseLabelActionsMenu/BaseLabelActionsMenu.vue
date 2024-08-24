<template>
  <BasePopup :is-visible="isLabelActionMenuOpen" @close="closeLabelActionMenu">
    <div class="p-3 lg:p-5">
      <div class="flex items-center">
        <div
          class="flex-shrink-0 w-5 h-5 mr-2 rounded-full"
          :style="{ backgroundColor: currentEditingLabel?.color }"
          data-test-id="label-list-item-color"
        />
        <span
          v-if="currentEditingLabel && 'scopeTitle' in currentEditingLabel"
          class="mr-2 text-lg text-slate-400"
        >
          {{ currentEditingLabel?.scopeTitle }}
        </span>
        <span class="text-lg font-semibold">{{ currentEditingLabel?.name }}</span>
      </div>
    </div>

    <div>
      <BaseButton
        v-if="!showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-red-500 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="showDeleteConfirmation = !showDeleteConfirmation"
        data-test-id="delete-label-button"
      >
        <template #leftIcon>
          <div class="mr-3">
            <TrashIcon class="w-6 h-6" />
          </div>
        </template>
        Delete
      </BaseButton>
      <BaseButton
        v-if="showDeleteConfirmation"
        class="!p-3 lg:!p-5 !text-sm !text-white !bg-red-600 !justify-start !border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        @click="remove()"
        data-test-id="confirm-delete-label-button"
      >
        <template #leftIcon>
          <div class="mr-3">
            <TrashIcon class="w-6 h-6" />
          </div>
        </template>
        Confirm deletion
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { TrashIcon } from '@heroicons/vue/24/outline';
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
