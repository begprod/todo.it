<template>
  <div class="header">
    <BaseLogo />

    <div class="header__links">
      <BaseNavigation />

      <a href="https://github.com/begprod/todo.it" class="header__github" target="_blank">
        <img
          src="@/assets/images/github-mark.svg"
          alt="todo.it github"
          data-test-id="github-image"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-bg-border);
}

.header__links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header__github {
  flex-shrink: 0;

  img {
    width: 1.5rem;
    opacity: 0.8;
    transition: 0.3s ease-in-out;
    transition-property: opacity;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
