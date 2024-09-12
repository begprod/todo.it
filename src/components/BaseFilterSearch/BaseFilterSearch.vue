<template>
  <div v-if="searchItems.length > 0" class="relative flex items-center px-5 my-5">
    <BaseInput
      v-model="searchQuery"
      :id="id"
      :placeholder="placeholder"
      type="text"
      data-test-id="label-search-input"
      autocomplete="off"
      @on-focus="focusHandler"
    >
      <template #icon-left>
        <TagIcon class="w-6 h-6 text-amber-500" />
      </template>
    </BaseInput>

    <div
      v-if="filteredSearchItems.length > 0"
      class="absolute bottom-full left-0 right-0 p-5 pb-0 w-full"
    >
      <div class="p-5 bg-white rounded-md shadow-sm max-h-56 overflow-y-auto">
        <BaseLabelList :labels="filteredSearchItems" @item-action="onClickItem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFilterSearchItem } from '@/types';
import { ref, computed } from 'vue';
import { TagIcon } from '@heroicons/vue/24/outline';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';

interface IProps {
  id: string;
  placeholder: string;
  searchItems: Array<IFilterSearchItem>;
}

const props = defineProps<IProps>();
const emit = defineEmits(['item-action']);

const isDropDownListVisible = ref<boolean>(false);
const searchQuery = ref<string>('');
const filteredSearchItems = computed(() => {
  return props.searchItems.filter((item) => {
    if (!item.searchString) {
      throw new Error('Search string is not defined in search item');
    }

    return item.searchString.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const focusHandler = () => {
  isDropDownListVisible.value = true;
};

const onClickItem = (item: IFilterSearchItem) => {
  emit('item-action', item);
  searchQuery.value = '';
};
</script>
