<template>
  <header class="fixed top-0 w-full px-5 py-2 border-b bg-white z-20">
    <div>
      <div class="flex items-center">
        <BaseButton
          class="!justify-start !w-auto border-none !shadow-none hover:shadow-none hover:bg-slate-100"
        >
          <v-icon name="bi-layout-sidebar-inset" />
        </BaseButton>
        <a href="/" class="flex items-end text-3xl ml-5 font-medium leading-8">
          <div>todo.it</div>
          <sub class="text-sm ml-1 bottom-0">beta</sub>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/controls/BaseButton.vue';
</script>
