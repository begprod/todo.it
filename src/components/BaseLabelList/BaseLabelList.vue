<template>
  <div class="flex flex-col w-full max-w-full overflow-hidden">
    <span v-if="title" class="text-sm font-semibold mb-2" data-test-id="label-list-title">
      {{ title }}:
    </span>

    <div
      class="group flex items-center py-1 px-3 rounded-md border border-transparent cursor-pointer hover:border hover:border-slate-300 transition-all duration-300"
      v-for="label in sortedLabels"
      :key="label.id"
      data-test-id="label-list-item"
      @click="onItemAction(label)"
    >
      <div
        class="flex-shrink-0 w-5 h-5 mr-2 rounded-full"
        :style="{ backgroundColor: label.color }"
        data-test-id="label-list-item-color"
      />

      <div class="grow max-w-full overflow-hidden">
        <div
          v-if="'scopeTitle' in label"
          class="max-w-full text-xs text-slate-500 truncate"
          data-test-id="label-list-item-scope"
          :title="label.scopeTitle ? label.scopeTitle : ''"
        >
          {{ label.scopeTitle }}
        </div>
        <div
          class="max-w-full text-sm truncate"
          :title="label.name"
          data-test-id="label-list-item-name"
        >
          {{ label.name }}
        </div>
      </div>

      <BaseButton
        v-if="showLabelActionMenu"
        class="shrink !w-auto p-[2px] !border-none xl:opacity-0 group-hover:opacity-100"
        title="Open label actions menu"
        @click="openActionMenu(label)"
        data-test-id="label-list-item-actions-button"
      >
        <EllipsisVertical class="w-5 h-5" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ILabel } from '@/types';
import { EllipsisVertical } from 'lucide-vue-next';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

interface IProps {
  title?: string;
  labels: Array<ILabel>;
  showLabelActionMenu?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showLabelActionMenu: false,
});

const emit = defineEmits(['open-action-menu', 'item-action']);

const sortedLabels = computed(() => {
  return [...props.labels].sort((a, b) => {
    if (a.scopeTitle && b.scopeTitle) {
      return a.scopeTitle.localeCompare(b.scopeTitle);
    }

    return a.name.localeCompare(b.name);
  });
});

const openActionMenu = (label: ILabel) => {
  emit('open-action-menu', label);
};

const onItemAction = (label: ILabel) => {
  emit('item-action', label);
};

defineExpose({
  openActionMenu,
  onItemAction,
});
</script>
