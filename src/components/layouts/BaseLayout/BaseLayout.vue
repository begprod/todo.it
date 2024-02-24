<template>
  <main class="mx-auto pb-10">
    <div class="flex flex-col lg:flex-row">
      <BaseSidebar />
      <BaseTaskList />
    </div>
  </main>

  <BaseTaskActionsMenu />
  <BaseFooter />
</template>

<script setup lang="ts">
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
</script>
