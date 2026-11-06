<template>
  <BasePopup :is-visible="isProjectFormOpen" @close="closeProjectForm">
    <form id="add-project-form" class="project-form" @submit.prevent="submitNewProject()">
      <BaseInput
        v-model="newProjectTitle"
        id="project-title"
        type="text"
        placeholder="Enter project title"
        autocomplete="off"
        autofocus
        data-test-id="project-title-input"
      />

      <ColorPicker
        v-model:pureColor="newProjectColor"
        format="hex6"
        shape="circle"
        :z-index="10000"
        :disable-history="true"
        :disable-alpha="true"
        :is-widget="true"
      />

      <BaseSelect
        v-model="newProjectPriority"
        id="project-priority"
        :options="['1', '2', '3', '4', '5']"
        placeholder="Select priority"
      />

      <BaseButton type="submit" title="Save project" data-test-id="save-project"> Save </BaseButton>
    </form>
  </BasePopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, usePopupsStore, useProjectsStore } from '@/stores';
import type { IProject } from '@/types';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const popupsStore = usePopupsStore();
const projectsStore = useProjectsStore();
const { isProjectFormOpen } = storeToRefs(popupsStore);
const { setMessage, setStatus, showToast } = commonStore;
const { closeProjectForm } = popupsStore;
const { createProject } = projectsStore;

const newProjectTitle = ref<string>('');
const newProjectColor = ref<string>('#000000');
const newProjectPriority = ref<string>('1');
const projectSchemas = {
  title: string().trim().required('Please enter project title').label('Project title'),
  color: string().required('Please choose project color').label('Project color'),
  priority: string()
    .required('Please select project priority')
    .oneOf(['1', '2', '3', '4', '5'], 'Please select a valid project priority')
    .label('Project priority'),
};

const submitNewProject = () => {
  try {
    const title = newProjectTitle.value.trim();

    projectSchemas.title.validateSync(title);
    projectSchemas.color.validateSync(newProjectColor.value);
    projectSchemas.priority.validateSync(newProjectPriority.value);

    const timestamp = new Date().toISOString();
    const project: IProject = {
      id: uuidv4(),
      title,
      color: newProjectColor.value,
      priority: Number(newProjectPriority.value),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    createProject(project);

    newProjectTitle.value = '';
    newProjectColor.value = '#000000';
    newProjectPriority.value = '1';

    closeProjectForm();
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Unknown error');
    setStatus('error');
    showToast();
  }
};
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}
</style>
