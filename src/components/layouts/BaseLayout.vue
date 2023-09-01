<template>
  <BaseHeader />

  <main class="container min-h-[calc(100vh-120px)] mx-auto p-5 lg:pb-10">
    <div class="flex flex-col lg:flex-row">
      <BaseSidebar />
      <BaseTaskList />
    </div>
  </main>

  <BaseTaskActionsMenu />
  <BaseFooter />
</template>

<script setup lang="ts">
import BaseHeader from '@/components/layouts/partials/BaseHeader.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar.vue';
import BaseTaskList from '@/components/BaseTaskList.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu.vue';
</script>
