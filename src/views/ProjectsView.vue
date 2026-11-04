<template>
  <BaseLayout>
    <template #title>
      <div class="title">
        <span>Projects list</span>

        <BaseButton class="projects-list__item">
          <Plus />
        </BaseButton>
      </div>
    </template>

    <BaseProjectsList />
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseProjectsList from '@/components/BaseProjectsList/BaseProjectsList.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import { Plus } from 'lucide-vue-next';
</script>

<style scoped>
.title {
  display: grid;
  grid-template-columns: auto 50px;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}
</style>
