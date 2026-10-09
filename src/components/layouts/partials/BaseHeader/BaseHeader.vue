<template>
  <div class="header">
    <BaseLogo />

    <div class="header__links">
      <BaseNavigation />

      <BaseButton
        title="Collapse/Expand settings sidebar"
        @click="toggleSettings"
        data-test-id="toggle-settings-button"
      >
        <Settings class="icon icon_sm" />
      </BaseButton>

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
import { useCommonStore } from '@/stores';
import { Settings } from 'lucide-vue-next';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();

const { toggleSettings } = commonStore;
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
  gap: 1rem;
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
