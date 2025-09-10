<template>
  <div class="label-list">
    <span v-if="title" class="label-list__title" data-test-id="label-list-title">
      {{ title }}:
    </span>

    <div
      class="label-list-item"
      v-for="(label, index) in labels"
      :key="label.id"
      :class="{
        'label-list-item_active': index === selectedItemIndex,
      }"
      ref="itemsRef"
      data-test-id="label-list-item"
      role="option"
      @click="onItemAction(label)"
    >
      <div
        class="label-list-item__color"
        :style="{ backgroundColor: label.color }"
        data-test-id="label-list-item-color"
      />

      <div class="label-list-item__description">
        <div
          v-if="'scopeTitle' in label"
          class="label-list__scope"
          data-test-id="label-list-item-scope"
          :title="label.scopeTitle ? label.scopeTitle : ''"
        >
          {{ label.scopeTitle }}
        </div>
        <div class="label-list__label" :title="label.name" data-test-id="label-list-item-name">
          {{ label.name }}
        </div>
      </div>

      <BaseButton
        v-if="showLabelActionMenu"
        class="label-list-item__button"
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
import { ref, computed, watch } from 'vue';
import type { IScope, ILabel } from '@/types';
import { EllipsisVertical } from 'lucide-vue-next';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

interface IProps {
  labels: Array<ILabel | IScope>;
  title?: string;
  selectedItemIndex?: number;
  showLabelActionMenu?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showLabelActionMenu: false,
});

const emit = defineEmits(['open-action-menu', 'item-action']);

const itemsRef = ref<Array<HTMLHtmlElement>>([]);
const currentItemIndex = computed(() => props.selectedItemIndex);

watch(currentItemIndex, () => {
  if (currentItemIndex.value === undefined) {
    return;
  }

  scrollToSelectedElement(currentItemIndex.value);
});

const scrollToSelectedElement = (index: number) => {
  if (!itemsRef.value[index]) {
    return;
  }

  itemsRef.value[index].scrollIntoView({ block: 'center' });
};

const openActionMenu = (label: ILabel | IScope) => {
  emit('open-action-menu', label);
};

const onItemAction = (label: ILabel | IScope) => {
  emit('item-action', label);
};

defineExpose({
  openActionMenu,
  onItemAction,
});
</script>

<style scoped>
.label-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.label-list__title {
  font-size: var(--typo-size-sm);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.label-list-item {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border: 1px solid transparent;
  border-radius: var(--rounded-md);
  cursor: pointer;
  transition: 0.3s ease-in-out;
  transition-property: background-color, border-color;

  &:hover {
    border-color: var(--color-bg-border);
    border-color: var(--color-bg-border-hover);
    background-color: var(--color-bg-surface-secondary);

    .label-list-item__button {
      opacity: 1;
    }
  }
}

.label-list-item_active {
  background-color: var(--color-bg-surface-secondary);
}

.label-list-item__color {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  border-radius: var(--rounded-full);
}

.label-list-item__description {
  flex-grow: 1;
  max-width: 100%;
  overflow: hidden;
}

.label-list__scope {
  max-width: 100%;
  color: var(--color-typo-trinary);
  font-size: var(--typo-size-xs);
  text-overflow: ellipsis;
  overflow: hidden;
}

.label-list__label {
  max-width: 100%;
  font-size: var(--typo-size-sm);
  text-overflow: ellipsis;
  overflow: hidden;
}

.label-list-item__button {
  opacity: 0;
  flex-shrink: 0;
  width: auto;
  padding: 0.13rem;
  transition: 0.3s ease-in-out;
  transition-property: opacity;
}
</style>
