<template>
  <div
    class="inline-flex items-center justify-center px-2 text-sm text-white leading-normal rounded-2xl"
    :style="`background-color: ${color}`"
  >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  color: string;
}

defineProps<IProps>();
</script>
