<template>
  <header class="sticky top-0 w-full bg-white z-[100]">
    <div class="container mx-auto p-3 flex items-center justify-between">
      <div class="flex items-center">
        <BaseLogo />
      </div>
      <a href="https://github.com/begprod/todo.it" target="_blank">
        <img
          src="@/assets/images/github-mark.svg"
          class="w-7 opacity-80 hover:opacity-100 transition-all duration-300"
          width="40"
          height="40"
          alt="todo.it github"
        />
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
</script>
