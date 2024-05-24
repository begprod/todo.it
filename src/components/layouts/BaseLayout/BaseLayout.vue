<template>
  <main class="mx-auto">
    <div class="flex flex-col lg:flex-row">
      <BaseBacklog />
      <BaseTaskList />
      <BaseSettings />
    </div>
  </main>

  <BaseTaskActionsMenu />
</template>

<script setup lang="ts">
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
</script>
