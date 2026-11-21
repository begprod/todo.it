<template>
  <BaseLayout>
    <template #title>
      <h1>Projects list</h1>

      <BaseButton title="Add project" data-test-id="add-project" @click="openProjectForm()">
        <Plus />
      </BaseButton>
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
