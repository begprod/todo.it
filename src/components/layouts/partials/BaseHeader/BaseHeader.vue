<template>
  <header class="sticky top-0 w-full bg-white z-[100]">
    <div class="container mx-auto p-3 flex items-center justify-between">
      <div class="flex items-center">
        <a href="/todo.it/" class="flex items-end font-bold">
          <div class="logo-gradient gradient-animation text-2xl">todo.it</div>
          <sub class="logo-sub-gradient gradient-animation text-sm ml-2 bottom-0">
            v{{ version }}
          </sub>
        </a>
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
