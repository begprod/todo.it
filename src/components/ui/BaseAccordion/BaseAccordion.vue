<template>
  <div class="mb-5 bg-white border-b border-slate-200 first:border-t-0 last:border-b-0">
    <div :id="id" class="flex items-center py-3 bg-white" :class="classes">
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center text-sm select-none">
          <slot name="title" />
        </div>
        <div class="flex items-center">
          <slot name="action" />
          <BaseButton class="ml-2" title="Collapse/Expand" @click="clickHandler">
            <ChevronUpIcon v-if="isOpen" class="w-4 h-4" />
            <ChevronDownIcon v-else class="w-4 h-4" />
          </BaseButton>
        </div>
      </div>
    </div>

    <Transition name="slide-up">
      <div v-if="isOpen" class="grid gap-3 lg:gap-5 w-full pr-0 pb-3 lg:pb-5">
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';
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
.slide-up {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-out;
  }

  &-enter-from,
  &-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>
