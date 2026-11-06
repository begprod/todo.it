<template>
  <div class="projects-list">
    <BaseEmptyListMessage v-if="!projects.length" message="Projects list is empty" />

    <div v-for="project in projects" :key="project.id" class="projects-list__item">
      <div class="projects-list__item-header">
        <span
          class="projects-list__item-color"
          :style="{ backgroundColor: project.color }"
          aria-hidden="true"
        />
        <div class="projects-list__item-title">{{ project.title }}</div>
      </div>
      <div class="projects-list__item-description">Priority: {{ project.priority }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

const projectsStore = useProjectsStore();
const { projects } = storeToRefs(projectsStore);
</script>

<style scoped>
.projects-list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: stretch;
  gap: 1rem;
  width: 100%;
  min-height: 10rem;
  padding: 1rem 0;
}

.projects-list__item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-height: 7.5rem;
  border-radius: var(--rounded-lg);
  background-color: var(--color-bg-surface-secondary);
  box-shadow: rgba(0, 0, 0, 0.06) 0 0.625rem 0.625rem 0;
}

.projects-list__item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.projects-list__item-color {
  flex: 0 0 0.75rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.projects-list__item-title {
  font-weight: bold;
  overflow-wrap: anywhere;
}

.projects-list__item-description {
  font-size: var(--typo-size-sm);
  color: var(--color-typo-trinary);
}
</style>
