<template>
  <a href="/todo.it/" class="logo">
    <div class="logo-gradient gradient-animation logo__text">todo.it</div>
    <div class="logo-sub-gradient gradient-animation logo__version">v{{ version }}</div>
  </a>
</template>

<script setup lang="ts">
import { version } from '../../../../../package.json';
</script>

<style scoped>
.logo {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  font-weight: 700;
}

.logo__text {
  font-size: 1.5rem;
  line-height: 1;
}

.logo__version {
  font-size: 0.75rem;
  line-height: 1.1;
}

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
