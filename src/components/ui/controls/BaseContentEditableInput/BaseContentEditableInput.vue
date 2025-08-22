<template>
  <div>
    <div
      ref="contentEditableFieldRef"
      class="contenteditable-field theme_typo_default"
      :class="classes"
      :title="title"
      :contenteditable="isContenteditable"
      :data-placeholder="placeholder"
      :data-test-id="dataTestId"
      @mouseover="onMouseOverHandler"
      @focus="onFocusHandler"
      @input="onInputHandler"
      @blur="onBlurHandler"
      @keydown.esc="onEscapeKeyDown"
    />
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import TodoList from 'markdown-it-task-lists';
import { ref, computed, onMounted } from 'vue';

const markdownIt = new MarkdownIt().use(TodoList);

interface IProps {
  modelValue: string;
  isContenteditable: boolean;
  title?: string;
  placeholder?: string;
  isRequired?: boolean;
  dataTestId?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  isContenteditable: true,
  isRequired: false,
});

const emit = defineEmits(['update:modelValue', 'focus', 'mouseover', 'blur', 'keydown.esc']);

const contentEditableFieldRef = ref<HTMLElement>();
const mouseOverActiveElement = ref<any>(null);
const fieldValue = ref<string>(props.modelValue);

onMounted(() => {
  if (contentEditableFieldRef.value) {
    contentEditableFieldRef.value.innerHTML = markdownIt.render(props.modelValue, {
      breaks: true,
    });
  }

  if (!props.modelValue && props.isRequired) {
    contentEditableFieldRef.value?.focus();
  }
});

const onMouseOverHandler = (event: any) => {
  if (event.target.tagName !== 'A') {
    mouseOverActiveElement.value = null;

    return;
  }

  mouseOverActiveElement.value = event.target;

  emit('mouseover');
};

const onFocusHandler = () => {
  if (!contentEditableFieldRef.value) {
    return;
  }

  if (mouseOverActiveElement.value !== null) {
    window.open(mouseOverActiveElement.value.href, '_blank');

    mouseOverActiveElement.value = null;
    contentEditableFieldRef.value.innerText = fieldValue.value;

    contentEditableFieldRef.value.blur();

    return;
  }

  contentEditableFieldRef.value.innerText = fieldValue.value;

  emit('focus');
};

const onInputHandler = () => {
  fieldValue.value = contentEditableFieldRef.value?.innerText || '';

  emit('update:modelValue', fieldValue.value);
};

const onBlurHandler = () => {
  if (!contentEditableFieldRef.value) {
    return;
  }

  fieldValue.value = contentEditableFieldRef.value?.innerText || '';

  contentEditableFieldRef.value.innerHTML = markdownIt.render(props.modelValue, {
    breaks: true,
  });

  emit('blur');
};

const onEscapeKeyDown = () => {
  contentEditableFieldRef.value?.blur();
};

const classes = computed(() => ({
  'contenteditable-field_disabled': !props.isContenteditable,
}));
</script>

<style scoped>
.contenteditable-field {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-height: 50px;
  max-height: 500px;
  padding: 0.25rem;
  font-size: var(--typo-size-sm);
  border-radius: var(--rounded-md);
  border: 1px solid transparent;
  word-break: break-all;
  overflow-wrap: break-word;
  overflow-x: auto;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  transition-property: background-color, opacity;

  :deep(*) {
    pointer-events: none;
  }

  :deep(a) {
    pointer-events: auto;
  }

  &:empty::after {
    content: attr(data-placeholder);
    position: absolute;
    top: 4px;
    opacity: 0.3;
  }

  &:hover {
    background-color: var(--color-bg-surface-secondary);
  }

  &:focus {
    outline: none;
    background-color: var(--color-bg-surface-trinary);
    border: 1px solid var(--color-bg-border);
    cursor: default;
  }
}

.contenteditable-field_disabled {
  opacity: 0.5;
}
</style>
