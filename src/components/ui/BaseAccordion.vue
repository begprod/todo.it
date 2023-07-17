<template>
  <div class="rounded-md">
    <div
      class="flex items-center p-5 border border-neutral-200 rounded-md border-l-8 border-l-gray-500 hover:bg-neutral-100 cursor-pointer transition-all duration-300"
      :class="classes"
      @click="toggle"
    >
      <div class="flex items-end">
        <h2 :class="titleClasses">{{ title }}</h2>
        <div class="ml-2 text-sm font-semibold">{{ subTitle }}</div>
      </div>
    </div>
    <div
      v-if="isOpen"
      class="grid gap-5 p-10 rounded-md"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface IProps {
  title: string;
  titleClasses?: string;
  subTitle?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  titleClasses: 'text-5xl font-semibold',
  isOpen: false,
  isActive: false,
});
const isOpen = ref(props.isOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const classes = computed(() => ({
  '!border-l-8 !border-l-emerald-500': props.isOpen && props.isActive,
  'opacity-40': !isOpen.value && !props.isActive,
}));
</script>
