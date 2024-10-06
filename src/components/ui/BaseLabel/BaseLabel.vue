<template>
  <div class="flex items-center">
    <div
      v-if="scopeTitle"
      class="inline-flex items-center justify-center px-2 text-xs text-slate-800 leading-normal border-2 rounded-l-xl"
      :style="scopeStyles"
      :title="scopeTitle"
      data-test-id="scope-title"
    >
      <span class="max-w-28 lg:max-w-52 truncate">{{ scopeTitle }}</span>
    </div>
    <div
      class="inline-flex items-center px-2 text-xs text-white leading-normal border-2 rounded-xl"
      :class="[labelHasScopeClasses, labelHasScopeStyles]"
      :style="labelHasScopeStyles"
      :title="title"
      data-test-id="label"
    >
      <span class="max-w-28 lg:max-w-52 truncate">{{ title }}</span>
      <div
        data-test-id="delete-icon"
        v-if="isDeletable"
        class="ml-2 h-4 w-4 cursor-pointer"
        @click="removeLabel"
      >
        <XMarkIcon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

interface IProps {
  title: string;
  color: string;
  scopeTitle?: string | null;
  isDeletable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  scopeTitle: null,
  isDeletable: false,
});
const emit = defineEmits(['remove-label']);

const exceptionColors = (color: string) => {
  switch (color) {
    case '#ffffff':
      return '#000000';
    case '#000000':
    case '#212121':
    case '#353535':
    case '#4b4b4b':
    case '#fe5722':
    case '#f5511e':
    case '#e64a19':
    case '#eb4165':
    case '#eb1d4e':
    case '#d81b43':
    case '#42a5f6':
    case '#2097f3':
    case '#1f87e8':
    case '#aa47bc':
    case '#9c28b1':
    case '#8e24aa':
    case '#7986cc':
    case '#5d35b0':
    case '#673bb7':
    case '#512da7':
    case '#26a59a':
    case '#029688':
    case '#008781':
    case '#4cb050':
    case '#05a045':
      return '#ffffff';
    default:
      return '#000000';
  }
};

const removeLabel = () => {
  emit('remove-label');
};

const labelHasScopeClasses = computed(() => ({
  '!rounded-l-none !text-slate-800 bg-none border-2': props.scopeTitle,
}));

const labelHasScopeStyles = computed(() => ({
  backgroundColor: props.scopeTitle ? 'bg-none' : `${props.color}`,
  borderColor: `${props.color}`,
  color: exceptionColors(props.color),
}));

const scopeStyles = computed(() => ({
  backgroundColor: `${props.color}`,
  borderColor: `${props.color}`,
  color: exceptionColors(props.color),
}));
</script>
