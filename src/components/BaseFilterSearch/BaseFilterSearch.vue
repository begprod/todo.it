<template>
  <div v-if="searchItems.length" class="filter-search">
    <BaseInput
      v-model="searchQuery"
      :id="id"
      :placeholder="placeholder"
      type="text"
      data-test-id="label-search-input"
      autocomplete="off"
      autofocus
      @on-key-up="selectPreviousItem"
      @on-key-down="selectNextItem"
      @on-key-enter="selectItem"
    >
      <template #icon-left>
        <Tags class="w-6 h-6 text-amber-500" />
      </template>
    </BaseInput>

    <div v-if="filteredSearchItems.length" class="filter-search__list">
      <div class="filter-search__list-inner" data-test-id="items-search-list">
        <BaseLabelList
          :key="searchQuery"
          :labels="filteredSearchItems"
          :selected-item-index="selectedItemIndex"
          @item-action="itemActionHandler"
        />
      </div>
    </div>
  </div>

  <div v-if="!searchItems.length" class="filter-search__empty-message" data-test-id="empty-message">
    You can add more labels
    <span>
      <Tags class="icon icon_lg" />
    </span>
    in settings
    <span>
      <Settings class="icon icon_lg" />
    </span>
    or create your first
  </div>
</template>

<script setup lang="ts">
import type { IFilterSearchItem } from '@/types';
import { ref, computed } from 'vue';
import { Tags, Settings } from 'lucide-vue-next';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';

interface IProps {
  id: string;
  placeholder: string;
  searchItems: Array<IFilterSearchItem>;
}

const props = defineProps<IProps>();
const emit = defineEmits(['item-action']);

const searchQuery = ref<string>('');
const selectedItemIndex = ref<number>(-1);

const filteredSearchItems = computed(() => {
  return props.searchItems.filter((item) => {
    if (!item.searchString) {
      throw new Error('Search string is not defined in search item');
    }

    return item.searchString.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const itemActionHandler = (item: IFilterSearchItem) => {
  emit('item-action', item);
};

const selectNextItem = () => {
  selectedItemIndex.value < filteredSearchItems.value.length - 1
    ? selectedItemIndex.value++
    : (selectedItemIndex.value = 0);
};

const selectPreviousItem = () => {
  selectedItemIndex.value > 0
    ? selectedItemIndex.value--
    : (selectedItemIndex.value = filteredSearchItems.value.length - 1);
};

const selectItem = () => {
  if (!filteredSearchItems.value[selectedItemIndex.value]) {
    return;
  }

  itemActionHandler(filteredSearchItems.value[selectedItemIndex.value]);
};

defineExpose({
  searchQuery,
  selectedItemIndex,
  selectNextItem,
  selectPreviousItem,
});
</script>

<style scoped>
.filter-search {
  position: relative;
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  padding: 0 1.25rem;
}

.filter-search__list {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  padding: 1.25rem 1.25rem 0 1.25rem;
}

.filter-search__list-inner {
  padding: 1.25rem;
  max-height: 220px;
  background-color: var(--color-bg-surface);
  border-radius: var(--rounded-md);
  overflow-y: auto;
}

.filter-search__empty-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;

  span {
    margin: 0 0.5rem;
  }
}
</style>
