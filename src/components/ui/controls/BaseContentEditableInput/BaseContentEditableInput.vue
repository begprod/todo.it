<template>
  <div>
    <div
      ref="contentEditableFieldRef"
      class="contenteditable-field theme_typo_default max-w-full p-1 lg:p-2 rounded-md overflow-x-auto focus:shadow-lg focus:bg-white focus:outline-none transition-all duration-300"
      :class="classes"
      :title="title"
      :contenteditable="isContenteditable"
      :data-placeholder="placeholder"
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
import { ref, computed, onMounted } from 'vue';

const markdownIt = new MarkdownIt();

interface IProps {
  modelValue: string;
  isContenteditable: boolean;
  title?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  isContenteditable: true,
});

const emit = defineEmits(['update:modelValue', 'focus', 'mouseover', 'blur', 'keydown.esc']);

const contentEditableFieldRef = ref<HTMLElement>();
const mouseOverActiveElement = ref<any>(null);
const fieldValue = ref<string>(props.modelValue);
const isFieldEmpty = computed(() => fieldValue.value.replace('<br>', '') === '');

onMounted(() => {
  if (contentEditableFieldRef.value) {
    contentEditableFieldRef.value.innerHTML = markdownIt.render(props.modelValue, {
      breaks: true,
    });
  }
});

const onMouseOverHandler = (event: Event) => {
  mouseOverActiveElement.value = event.target;

  emit('mouseover');
};

const onFocusHandler = () => {
  if (!contentEditableFieldRef.value) {
    return;
  }

  if (mouseOverActiveElement.value !== null && mouseOverActiveElement.value.tagName === 'A') {
    window.open(mouseOverActiveElement.value.href, '_blank');

    mouseOverActiveElement.value = null;

    contentEditableFieldRef.value.innerText = fieldValue.value;
    contentEditableFieldRef.value.blur();
    contentEditableFieldRef.value.innerHTML = markdownIt.render(props.modelValue, {
      breaks: true,
    });

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
  'is-active-placeholder': isFieldEmpty.value && props.isContenteditable,
  'opacity-60': !props.isContenteditable,
}));

defineExpose({
  contentEditableFieldRef,
  mouseOverActiveElement,
  fieldValue,
  isFieldEmpty,
  onFocusHandler,
});
</script>

<style scoped lang="scss">
.contenteditable-field {
  position: relative;
  width: 100%;
  max-height: 300px;
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
