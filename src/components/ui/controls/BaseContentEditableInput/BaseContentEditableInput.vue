<template>
  <div>
    <div
      ref="contentEditableFieldRef"
      class="contenteditable-field max-w-full p-1 lg:p-2 break-all rounded-md overflow-x-auto focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
      :class="classes"
      :contenteditable="isContentEditable"
      :title="title"
      :data-placeholder="placeholder"
      @input="inputHandler"
      @blur="blurHandler"
      @keydown.esc="keyDownHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface IProps {
  modelValue: string;
  isContentEditable: boolean | 'plaintext-only';
  isRequired?: boolean;
  title?: string;
  placeholder?: string;
  textSize?: 'sm' | 'lg';
  fontWeight?: 'normal' | 'semibold';
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  isContentEditable: true,
  isRequired: false,
  textSize: 'lg',
  fontWeight: 'semibold',
});

const emit = defineEmits(['update:modelValue', 'blur', 'keydown.esc']);

const contentEditableFieldRef = ref<HTMLElement>();
const fieldValue = ref<string>(props.modelValue);
const fieldIsEmpty = computed(() => fieldValue.value.replace('<br>', '') === '');

onMounted(() => {
  if (contentEditableFieldRef.value) {
    contentEditableFieldRef.value.innerHTML = props.modelValue;
  }

  if (!props.modelValue && props.isRequired) {
    contentEditableFieldRef.value?.focus();
  }
});

const inputHandler = () => {
  fieldValue.value = contentEditableFieldRef.value?.innerHTML || '';

  emit('update:modelValue', fieldValue.value);
};

const blurHandler = () => {
  emit('blur');
};

const keyDownHandler = () => {
  contentEditableFieldRef.value?.blur();
};

const classes = computed(() => ({
  'is-active-placeholder': fieldIsEmpty.value && props.isContentEditable,
  'opacity-60': !props.isContentEditable,
  'text-base lg:text-lg': props.textSize === 'lg',
  'sub-text text-sm': props.textSize === 'sm',
  'font-normal': props.fontWeight === 'normal',
  'font-semibold': props.fontWeight === 'semibold',
}));
</script>

<style scoped lang="scss">
.contenteditable-field {
  position: relative;
  max-height: 100px;

  :deep(*) {
    @apply break-all font-body font-bold text-black text-base bg-transparent w-full #{!important};

    @screen md {
      @apply text-lg #{!important};
    }
  }

  :deep(span) {
    @apply inline-block break-all whitespace-pre-wrap #{!important};
  }
}

.sub-text {
  max-height: 200px;

  :deep(*) {
    @apply text-sm font-normal #{!important};
  }
}

.is-active-placeholder {
  &::after {
    content: attr(data-placeholder);
    position: absolute;
    top: 4px;
    opacity: 0.3;

    @screen lg {
      top: 8px;
    }
  }
}
</style>
