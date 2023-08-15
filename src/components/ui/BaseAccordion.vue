<template>
  <div class="rounded-md">
    <div
      class="flex items-center p-5 rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all duration-300"
      :class="classes"
      @click="toggle"
    >
      <div v-if="isActive" class="w-4 h-4 mr-5 rounded-full bg-green-500" />
      <div class="flex items-end">
        <h2 class="text-xl font-semibold">
          {{ title }}
        </h2>
        <div class="ml-2 text-sm font-semibold">{{ subTitle }}</div>
      </div>
    </div>
    <div v-if="isOpen" class="grid gap-5 pt-5 pr-0 pb-5 pl-10 rounded-md">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface IProps {
  title: string;
  subTitle?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isOpen: false,
  isActive: false,
});

const isOpen = ref(props.isOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const classes = computed(() => ({
  'opacity-30': !isOpen.value && !props.isActive,
}));
</script>
