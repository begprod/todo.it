<template>
  <div v-if="searchItems.length > 0" class="relative flex items-center px-5 my-5">
    <BaseInput
      v-model="searchQuery"
      :id="id"
      :placeholder="placeholder"
      type="text"
      data-test-id="label-search-input"
      autocomplete="off"
    >
      <template #icon-left>
        <TagIcon class="w-6 h-6 text-amber-500" />
      </template>
    </BaseInput>

    <div
      v-if="filteredSearchItems.length > 0"
      class="absolute bottom-full left-0 right-0 p-5 pb-0 w-full"
    >
      <div
        class="p-5 bg-white rounded-md shadow-sm max-h-56 overflow-y-auto"
        data-test-id="items-search-list"
      >
        <BaseLabelList :labels="filteredSearchItems" @item-action="onClickItem" />
      </div>
    </div>
  </div>

  <div
    v-if="searchItems.length === 0"
    class="block text-center p-5 text-lg text-slate-500"
    data-test-id="empty-message"
  >
    You can add more labels
    <span class="inline-block align-middle"><TagIcon class="w-6 h-6" /></span> in settings
    <span class="inline-block align-middle"><Cog6ToothIcon class="w-6 h-6" /></span> or create your
    first
  </div>
</template>

<script setup lang="ts">
import type { IFilterSearchItem } from '@/types';
import { ref, computed } from 'vue';
import { TagIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
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
const filteredSearchItems = computed(() => {
  return props.searchItems.filter((item) => {
    if (!item.searchString) {
      throw new Error('Search string is not defined in search item');
    }

    return item.searchString.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const onClickItem = (item: IFilterSearchItem) => {
  emit('item-action', item);
  searchQuery.value = '';
};

defineExpose({
  searchQuery,
  onClickItem,
});
</script>
