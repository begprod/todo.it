<template>
  <div class="flex items-center">
    <div
      v-if="scopeTitle"
      class="inline-flex items-center justify-center px-2 text-sm text-slate-800 leading-normal border-2 rounded-l-xl"
      :style="scopeStyles"
      data-test-id="scope-title"
    >
      {{ scopeTitle }}
    </div>
    <div
      class="inline-flex items-center justify-center px-2 text-sm text-white leading-normal border-2 rounded-xl"
      :class="[labelHasScopeClasses, labelHasScopeStyles]"
      :style="labelHasScopeStyles"
      data-test-id="label"
    >
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
  title: string;
  color: string;
  scopeTitle?: string | null;
}

const props = withDefaults(defineProps<IProps>(), {
  scopeTitle: null,
});

const exceptionColors = (color: string) => {
  switch (color) {
    case '#ffffff':
      return '#000000';
    case '#000000':
    case '#212121':
    case '#353535':
    case '#4b4b4b':
    case '#512da7':
    case '#8e24aa':
    case '#05a045':
    case '#008781':
      return '#ffffff';
    default:
      return '#000000';
  }
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
