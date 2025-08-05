<template>
  <BaseSidebar :is-open="isBacklogOpen">
    <template #main>
      <div class="backlog">
        <div class="backlog__header">
          <BaseLogo />

          <div class="backlog__header-controls">
            <a
              href="https://github.com/begprod/todo.it"
              class="backlog__header-github"
              target="_blank"
            >
              <img
                src="@/assets/images/github-mark.svg"
                alt="todo.it github"
                data-test-id="github-image"
              />
            </a>

            <BaseButton
              title="Collapse/Expand settings sidebar"
              @click="toggleSettings"
              data-test-id="toggle-settings-button"
            >
              <Settings class="icon icon_sm" />
            </BaseButton>
          </div>
        </div>

        <div class="backlog__header-controls">
          <BaseButton
            @click="createTask('backlog')"
            title="Add task to backlog"
            data-test-id="add-task-to-backlog"
          >
            Add to backlog
            <template #rightIcon>
              <Plus class="icon icon_sm" />
            </template>
          </BaseButton>

          <BaseButton
            class="backlog__header-settings"
            title="Collapse backlog sidebar"
            @click="toggleSidebar"
            data-test-id="toggle-backlog-button"
          >
            <PanelLeftClose class="icon icon_sm" />
          </BaseButton>
        </div>
      </div>

      <div class="backlog__list">
        <BaseTaskListBacklog />
      </div>
    </template>

    <template #footer>
      <BaseFooter />
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Settings, Plus, PanelLeftClose } from 'lucide-vue-next';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

const commonStore = useCommonStore();
const tasksStore = useTasksStore();
const { toggleSidebar, toggleSettings } = commonStore;
const { isBacklogOpen } = storeToRefs(commonStore);
const { createTask } = tasksStore;
</script>

<style scoped>
.backlog {
  position: sticky;
  top: 0;
  margin-bottom: 0.75rem;
  padding: 1rem;
  background-color: var(--color-bg-surface-trinary);
  z-index: 10;
}

.backlog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.backlog__header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.backlog__header-github {
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

.backlog__header-settings {
  width: auto;
}

.backlog__list {
  padding: 1rem;
}
</style>
