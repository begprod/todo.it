<template>
  <BaseLayout>
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
  </BaseLayout>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';
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
