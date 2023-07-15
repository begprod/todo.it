<template>
  <div class="rounded-md">
    <div
      class="flex items-center p-5 border border-neutral-200 border-l-8 border-l-emerald-500 rounded-md hover:bg-neutral-100 cursor-pointer transition-colors duration-300"
      @click="toggle"
    >
      <v-icon
        class="mr-2"
        name="md-chevronright-twotone"
      />
      <h2
        class="text-5xl font-semibold"
        :class="titleClasses"
      >
        {{ title }}
      </h2>
    </div>
    <div
      v-if="isOpen"
      class="p-5 rounded-md"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface IProps {
  title: string;
  titleClasses?: string;
  isOpen?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isOpen: false,
});
const isOpen = ref(props.isOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// const classes = computed(() => ({
//   'bg-gray-50': isOpen.value,
//   'bg-white': !isOpen.value,
// }));
</script>
