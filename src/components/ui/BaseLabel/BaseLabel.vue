<template>
  <div class="label" :class="labelHasScopeClasses">
    <div
      v-if="scopeTitle"
      class="label__scope"
      :style="scopeStyles"
      :title="scopeTitle"
      data-test-id="scope-title"
    >
      <span class="label__text">{{ scopeTitle }}</span>
    </div>
    <div class="label__title" :style="labelHasScopeStyles" :title="title" data-test-id="label">
      <span class="label__text">{{ title }}</span>

      <div v-if="isDeletable" class="label__delete" data-test-id="delete-icon" @click="removeLabel">
        <X class="icon icon_sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

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
  label_has_scope: props.scopeTitle,
}));

const labelHasScopeStyles = computed(() => ({
  backgroundColor: props.scopeTitle ? '' : `${props.color}`,
  borderColor: `${props.color}`,
  color: exceptionColors(props.color),
}));

const scopeStyles = computed(() => ({
  backgroundColor: `${props.color}`,
  borderColor: `${props.color}`,
  color: exceptionColors(props.color),
}));
</script>

<style scoped>
.label {
  display: flex;
  align-items: center;
}

.label__scope {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  font-size: var(--typo-size-xs);
  line-height: 1.5;
  border: 2px solid;
  border-top-left-radius: var(--rounded-xl);
  border-bottom-left-radius: var(--rounded-xl);
}

.label__title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  color: var(--color-typo-secondary);
  font-size: var(--typo-size-xs);
  line-height: 1.5;
  border: 2px solid;
  border-radius: var(--rounded-xl);
}

.label__text {
  max-width: 13rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.label__delete {
  margin-left: 0.5rem;
  cursor: pointer;
}

.label_has_scope {
  .label__title {
    color: var(--color-typo-primary) !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
