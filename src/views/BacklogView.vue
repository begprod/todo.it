<template>
  <BaseHeader />

  <div class="backlog">
    <div class="backlog__controls">
      <BaseButton
        @click="createTask('backlog')"
        title="Add task to backlog"
        data-test-id="add-task-to-backlog"
      >
        Add task to backlog
        <template #rightIcon>
          <Plus class="icon icon_sm" />
        </template>
      </BaseButton>
    </div>

    <BaseTaskListBacklog />
  </div>

  <BaseTaskActionsMenu />
  <BaseTaskLabelMenu />
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import { useTasksStore } from '@/stores';

const tasksStore = useTasksStore();

const { createTask } = tasksStore;
</script>

<style scoped>
.backlog {
  position: relative;
  min-height: 100dvh;
  padding: 1rem;
}

.backlog__controls {
  margin-bottom: 1rem;
}
</style>
