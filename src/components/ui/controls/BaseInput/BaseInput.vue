<template>
  <div class="input">
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      :class="classes"
      :autofocus="autofocus"
      :data-test-id="dataTestId"
      @input="inputHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      @keydown.up.prevent="keyUpHandler"
      @keydown.down.prevent="keyDownHandler"
      @keyup.enter="keyEnterHandler"
      ref="inputRef"
      class="input__field"
    />

    <div class="input__icon input__icon_left">
      <slot name="icon-left" />
    </div>

    <div class="input__icon input__icon_right">
      <slot name="icon-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useSlots } from 'vue';

interface IProps {
  modelValue: string | number;
  id: string;
  type: string;
  placeholder: string;
  dataTestId?: string;
  autocomplete?: string;
  autofocus?: boolean;
  isError?: boolean;
}

onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});

const props = defineProps<IProps>();
const emit = defineEmits([
  'update:modelValue',
  'onFocus',
  'onBlur',
  'onKeyUp',
  'onKeyDown',
  'onKeyEnter',
]);
const slots = useSlots();

const inputRef = ref<HTMLInputElement | null>(null);

const hasIconLeft = computed(() => !!slots['icon-left']);
const hasIconRight = computed(() => !!slots['icon-right']);

const inputHandler = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const focusHandler = () => {
  emit('onFocus');
};

const blurHandler = () => {
  emit('onBlur');
};

const keyUpHandler = () => {
  emit('onKeyUp');
};

const keyDownHandler = () => {
  emit('onKeyDown');
};

const keyEnterHandler = () => {
  emit('onKeyEnter');
};

const classes = computed(() => {
  return {
    input__field_error: props.isError,
    input__field_icon_left: hasIconLeft.value,
    input__field_icon_right: hasIconRight.value,
  };
});
</script>

<style scoped>
.input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input__field {
  width: 100%;
  padding: 0.5rem;
  font-size: var(--typo-size-sm);
  border: 1px solid var(--color-bg-border);
  border-radius: var(--rounded-md);
  transition: 0.3s ease-in-out;
  transition-property: border-color;
  user-select: none;

  &:hover,
  &:focus {
    border-color: var(--color-bg-border-hover);
    outline: none;
  }
}

.input__field_error {
  border-color: var(--color-bg-border-alert);

  &:hover,
  &:focus {
    border-color: var(--color-bg-border-alert);
  }
}

.input__field_icon_left {
  padding-left: 2.25rem;
}

.input__field_icon_right {
  padding-right: 2.25rem;
}

.input__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.input__icon_left {
  left: 0.4rem;
}

.input__icon_right {
  right: 0.4rem;
}
</style>
