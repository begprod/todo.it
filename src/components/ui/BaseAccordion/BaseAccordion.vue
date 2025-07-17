<template>
  <div class="accordion">
    <div :id="id" class="accordion__inner" :class="classes">
      <div class="accordion__title">
        <slot name="title" />
      </div>
      <div class="accordion__controls">
        <slot name="action" />

        <BaseButton class="ml-2" title="Collapse/Expand" @click="clickHandler">
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
  isActive?: boolean;
  additionalClasses?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  isOpen: false,
  isActive: false,
});

const emits = defineEmits(['click']);

const isOpen = ref(props.isOpen);

const clickHandler = () => {
  emits('click');

  isOpen.value = !isOpen.value;
};

const classes = computed(() => ({
  'opacity-60 z-0': !isOpen.value && !props.isActive,
  ...(props.additionalClasses ? { [props.additionalClasses]: true } : {}),
}));
</script>

<style scoped lang="scss">
.accordion {
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-bg-border);
}

.accordion__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
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
}

.accordion__content {
  padding-bottom: 1.25rem;
}
</style>
