<template>
  <BasePopup :is-visible="isProjectEditFormOpen" @close="closeProjectEditForm">
    <form id="edit-project-form" class="project-edit-form" @submit.prevent="submitProject()">
      <BaseInput
        v-model="projectTitle"
        id="edit-project-title"
        type="text"
        placeholder="Enter project title"
        autocomplete="off"
        autofocus
      />

      <ColorPicker
        v-model:pureColor="projectColor"
        format="hex6"
        shape="circle"
        :z-index="10000"
        :disable-history="true"
        :disable-alpha="true"
        :is-widget="true"
      />

      <BaseSelect
        v-model="projectPriority"
        id="edit-project-priority"
        :options="['1', '2', '3', '4', '5']"
        placeholder="Select priority"
      />

      <div class="project-edit-form__controls">
        <BaseButton
          v-if="!showDeleteConfirmation"
          type="button"
          color="alert"
          title="Delete project"
          @click="showDeleteConfirmation = true"
        >
          Delete
        </BaseButton>
        <BaseButton
          v-else
          type="button"
          color="secondary"
          background="alert"
          title="Confirm deletion"
          @click="removeProject()"
        >
          Confirm deletion
        </BaseButton>
        <BaseButton type="submit" title="Save project"> Save </BaseButton>
      </div>
    </form>
  </BasePopup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, usePopupsStore, useProjectsStore, useTasksStore } from '@/stores';
import type { IProject } from '@/types';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const popupsStore = usePopupsStore();
const projectsStore = useProjectsStore();
const { isProjectInUse } = storeToRefs(useTasksStore());
const { currentEditingProject, isProjectEditFormOpen } = storeToRefs(popupsStore);
const { setMessage, setStatus, showToast } = commonStore;
const { closeProjectEditForm } = popupsStore;
const { updateProject, deleteProject } = projectsStore;

const projectTitle = ref<string>('');
const projectColor = ref<string>('#000000');
const projectPriority = ref<string>('');
const showDeleteConfirmation = ref<boolean>(false);
const projectSchemas = {
  title: string().trim().required('Please enter project title').label('Project title'),
  color: string().required('Please choose project color').label('Project color'),
  priority: string()
    .required('Please select project priority')
    .oneOf(['1', '2', '3', '4', '5'], 'Please select a valid project priority')
    .label('Project priority'),
};

watch(
  currentEditingProject,
  (project: IProject | null) => {
    showDeleteConfirmation.value = false;

    if (!project) {
      return;
    }

    projectTitle.value = project.title;
    projectColor.value = project.color;
    projectPriority.value = String(project.priority);
  },
  { immediate: true },
);

const removeProject = () => {
  if (!currentEditingProject.value) {
    return;
  }

  if (isProjectInUse.value(currentEditingProject.value.id)) {
    setMessage('Project has tasks and cannot be deleted');
    setStatus('error');
    showToast();

    return;
  }

  deleteProject(currentEditingProject.value.id);
  closeProjectEditForm();
  setMessage('Project deleted');
  setStatus('success');
  showToast();
};

const submitProject = () => {
  if (!currentEditingProject.value) {
    return;
  }

  try {
    const title = projectTitle.value.trim();

    projectSchemas.title.validateSync(title);
    projectSchemas.color.validateSync(projectColor.value);
    projectSchemas.priority.validateSync(projectPriority.value);

    updateProject({
      ...currentEditingProject.value,
      title,
      color: projectColor.value,
      priority: Number(projectPriority.value),
      updatedAt: new Date().toISOString(),
    });

    closeProjectEditForm();
    setMessage('Project updated');
    setStatus('success');
    showToast();
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Unknown error');
    setStatus('error');
    showToast();
  }
};
</script>

<style scoped>
.project-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.project-edit-form__controls {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
