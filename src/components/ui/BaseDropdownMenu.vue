<template>
  <div class="relative" v-click-outside="closeMenu">
    <BaseButton
      class="pt-0 pr-0 !bg-transparent border-transparent !shadow-none hover:shadow-none"
      type="button"
      title="Open menu"
      @click="toggleMenu"
    >
      <v-icon name="hi-dots-vertical" />
    </BaseButton>
    <div
      v-if="isMenuOpen"
      class="absolute right-0 top-full min-w-[240px] p-2 border border-neutral-200 text-neutral-600 rounded-xl shadow-sm bg-white overflow-hidden z-10 transition-all duration-300"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/controls/BaseButton.vue';

interface IProps {
  isMenuOpen: boolean;
}

defineProps<IProps>();

const emits = defineEmits(['toggleMenu', 'closeMenu']);

const toggleMenu = () => {
  emits('toggleMenu');
};

const closeMenu = () => {
  emits('closeMenu');
};
</script>
