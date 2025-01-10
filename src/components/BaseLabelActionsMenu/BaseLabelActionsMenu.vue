<template>
  <BasePopup :is-visible="isLabelActionMenuOpen" @close="closeLabelActionMenu">
    <div class="p-3 lg:p-5">
      <div class="flex items-center">
        <div
          class="flex-shrink-0 w-7 h-7 mr-2 rounded-full"
          :style="{ backgroundColor: currentEditingLabel?.color }"
          data-test-id="label-list-item-color"
        />
        <div class="flex flex-col overflow-hidden">
          <span
            v-if="currentEditingLabel && 'scopeTitle' in currentEditingLabel"
            class="max-w-full mr-2 text-lg text-slate-400 truncate"
            :title="currentEditingLabel?.scopeTitle ? currentEditingLabel?.scopeTitle : ''"
          >
            {{ currentEditingLabel?.scopeTitle }}
          </span>
          <span
            class="max-w-full text-lg font-semibold truncate"
            :title="currentEditingLabel?.name"
          >
            {{ currentEditingLabel?.name }}
          </span>
        </div>
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
            <Trash2 class="w-6 h-6" />
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
            <Trash2 class="w-6 h-6" />
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
