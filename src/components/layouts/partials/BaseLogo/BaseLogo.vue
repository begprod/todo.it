<template>
  <a href="/todo.it/" class="flex items-end font-bold">
    <div class="logo-gradient gradient-animation text-2xl">todo.it</div>
    <sub class="logo-sub-gradient gradient-animation text-sm ml-2 bottom-0"> v{{ version }} </sub>
  </a>
</template>

<script setup lang="ts">
// @ts-ignore
import { version } from '../../../../../package.json';
</script>

<style scoped lang="scss">
.logo-gradient {
  background-color: #4158d0;
  background-image: linear-gradient(43deg, #4158d0 0%, #c850c0 46%, #ffcc70 100%);
  background-size: 400%;
  background-repeat: repeat;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}

.logo-sub-gradient {
  background-color: #4158d0;
  background-image: linear-gradient(43deg, #ffcc70 0%, #c850c0 46%, #4158d0 100%);
  background-size: 400%;
  background-repeat: repeat;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}

.gradient-animation {
  animation: gradient 15s ease-in-out infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
