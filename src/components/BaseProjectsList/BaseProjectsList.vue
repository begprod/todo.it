<template>
  <div class="projects-list">
    <BaseEmptyListMessage v-if="!projects.length" message="Projects list is empty" />

    <div
      v-for="project in projects"
      :key="project.id"
      class="projects-list__item"
      @click="editProject(project)"
    >
      <div class="projects-list__item-header">
        <span
          class="projects-list__item-color"
          :style="{ backgroundColor: project.color }"
          aria-hidden="true"
        />
        <div class="projects-list__item-title" :title="project.title">{{ project.title }}</div>
      </div>
      <div class="projects-list__item-description">
        <Flag class="icon icon_sm" />
        Priority:
        {{ project.priority }}
      </div>
      <div class="projects-list__item-description">
        <CheckCircle class="icon icon_sm" />
        Tasks:
        {{ projectTaskCounts[project.id]?.done ?? 0 }}/{{
          projectTaskCounts[project.id]?.overall ?? 0
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Flag } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { usePopupsStore, useProjectsStore, useTasksStore } from '@/stores';
import type { IProject } from '@/types';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

const projectsStore = useProjectsStore();
const popupsStore = usePopupsStore();
const { projects } = storeToRefs(projectsStore);
const { projectTaskCounts } = storeToRefs(useTasksStore());
const { setCurrentEditingProject, openProjectEditForm } = popupsStore;

const editProject = (project: IProject) => {
  setCurrentEditingProject(project);
  openProjectEditForm();
};
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
  background-color: var(--color-bg-surface-raised);
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1rem;
  min-height: 7.5rem;
  border-radius: var(--rounded-lg);
  box-shadow: rgba(0, 0, 0, 0.06) 0 0.625rem 0.625rem 0;
  cursor: pointer;
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
  flex: 1;
  min-width: 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.projects-list__item-description {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: var(--typo-size-sm);
  color: var(--color-typo-trinary);
}
</style>
