<template>
  <BaseLayout>
    <template #title>
      <div class="title">
        <span>Projects list</span>

        <BaseButton title="Add project" data-test-id="add-project" @click="openProjectForm()">
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
import { usePopupsStore } from '@/stores';
import { Plus } from 'lucide-vue-next';

const popupsStore = usePopupsStore();
const { openProjectForm } = popupsStore;
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
