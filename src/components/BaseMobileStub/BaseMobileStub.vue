<template>
  <div class="stub">
    <BaseLogo />
    <p class="stub__text">Mobile version is coming soon.</p>
  </div>
</template>

<script setup lang="ts">
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
</script>

<style scoped>
.stub {
  display: none;
}

@media screen and (max-width: 1023.98px) {
  .stub {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    min-height: 100dvh;
    background-image: var(--color-bg-gradient);
    color: var(--color-typo-primary);
  }

  .stub__text {
    font-size: var(--typo-size-lg);
    text-align: center;
  }
}
</style>
