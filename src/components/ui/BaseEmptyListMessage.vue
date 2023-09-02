<template>
  <div class="flex items-center justify-center h-16 text-sm lg:text-lg text-neutral-200">
    <v-icon class="mr-2" name="md-cancel-outlined" />
    {{ message }}
  </div>
</template>

<script setup lang="ts">
interface IProps {
  message: string;
}

defineProps<IProps>();
</script>
