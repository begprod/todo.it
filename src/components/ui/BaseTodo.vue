<template>
  <div>
    {{ todo.title }}
    {{ todo.description }}
  </div>
</template>

<script setup lang="ts">
import type { ITodo } from '@/types';

interface IProps {
  todo: ITodo;
}

defineProps<IProps>();
</script>
