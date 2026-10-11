<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <BaseLogo />
      <BaseNavigation />
    </div>

    <div class="sidebar__footer">
      <BaseFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 320px;
  min-height: 100%;
  padding: 3rem 2rem 1rem 2rem;
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}
</style>
