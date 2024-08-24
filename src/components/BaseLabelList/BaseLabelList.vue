<template>
  <div class="flex flex-col w-full">
    <span class="text-sm font-semibold mb-2" data-test-id="label-list-title">{{ title }}: </span>

    <div
      class="group flex items-center py-1 px-3 rounded-md border border-transparent hover:border hover:border-slate-300 transition-all duration-300"
      v-for="label in labels"
      :key="label.id"
      data-test-id="label-list-item"
    >
      <div
        class="flex-shrink-0 w-5 h-5 mr-2 rounded-full"
        :style="{ backgroundColor: label.color }"
        data-test-id="label-list-item-color"
      />

      <div class="grow">
        <div
          v-if="'scopeTitle' in label"
          class="text-xs text-slate-500"
          data-test-id="label-list-item-scope"
        >
          {{ label.scopeTitle }}
        </div>
        <div class="text-sm" data-test-id="label-list-item-name">{{ label.name }}</div>
      </div>

      <BaseButton
        class="shrink !w-auto p-[2px] !border-none xl:opacity-0 group-hover:opacity-100"
        title="Open label actions menu"
        @click="openActionMenu(label)"
        data-test-id="label-list-item-actions-button"
      >
        <EllipsisVerticalIcon class="w-6 h-6" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILabel, IScope } from '@/types';
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import { useCommonStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const { setCurrentEditingLabel, openLabelActionMenu } = commonStore;

interface IProps {
  title: string;
  labels: Array<ILabel | IScope>;
}

defineProps<IProps>();

const openActionMenu = (label: ILabel | IScope) => {
  setCurrentEditingLabel(label);

  openLabelActionMenu();
};

defineExpose({
  openActionMenu,
});
</script>
