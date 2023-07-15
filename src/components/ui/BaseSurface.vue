<template>
  <div class="bg-white border border-gray-200 rounded-3xl shadow-lg shadow-gray-200">
    <div
      class="p-10"
      :class="classes"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  classes?: string;
}

defineProps<IProps>();
</script>
