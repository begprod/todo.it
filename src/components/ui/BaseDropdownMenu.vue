<template>
  <div class="relative">
    <BaseButton
      class="pt-0 pr-0 bg-transparent border-transparent shadow-none hover:shadow-none"
      @click="toggleMenu"
    >
      <v-icon name="hi-dots-vertical" />
    </BaseButton>
    <div
      v-if="isMenuOpen"
      class="absolute right-0 top-full min-w-[200px] py-3 px-4 border border-neutral-200 text-neutral-600 rounded-xl shadow-sm bg-white z-10 hover:shadow-lg transition-all duration-300"
    >
      <slot></slot>
      its menu
      its menu
      its menu
      its menu
      its menu
      its menu
      its menu
      its menu
      its menu
      its menu
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/ui/controls/BaseButton.vue';

const isMenuOpen = ref<boolean>(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
