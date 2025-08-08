<template>
  <div class="accordion" :class="classes">
    <div :id="id" class="accordion__header">
      <div class="accordion__title">
        <slot name="title" />
      </div>
      <div class="accordion__controls">
        <div class="accordion__actions">
          <slot name="action" />
        </div>

        <BaseButton title="Collapse/Expand" @click="clickHandler">
          <ChevronUp v-if="isOpen" class="icon_base" />
          <ChevronDown v-else class="icon_base" />
        </BaseButton>
      </div>
    </div>

    <Transition name="slide-up">
      <div v-if="isOpen" class="accordion__content">
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

interface IProps {
  id?: string;
  isOpen?: boolean;
  isHeaderSticky?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isOpen: false,
  isHeaderSticky: false,
});

const emits = defineEmits(['click']);

const isOpen = ref(props.isOpen);

const clickHandler = () => {
  emits('click');

  isOpen.value = !isOpen.value;
};

const classes = computed(() => ({
  accordion_open: isOpen.value,
  accordion_header_sticky: props.isHeaderSticky,
}));
</script>

<style scoped lang="scss">
.accordion {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  max-width: 100%;
  width: 100%;
  border-bottom: 1px solid var(--color-bg-border);
}

.accordion_open .accordion__header {
  opacity: 1;
}

.accordion_header_sticky .accordion__header {
  position: sticky;
  top: 0;
  background-color: var(--color-bg-surface);
  z-index: 20;
}

.accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0 0.75rem 0;
  opacity: 0.5;
  transition: 0.3s ease-in-out;
  transition-property: opacity;
  z-index: 0;
}

.accordion__title {
  display: flex;
  align-items: center;
  user-select: none;
}

.accordion__title:deep(*) {
  font-size: var(--typo-size-sm);
  line-height: 1.2;
}

.accordion__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accordion__content {
  display: grid;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
}
</style>
