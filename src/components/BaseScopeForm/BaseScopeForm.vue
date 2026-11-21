<template>
  <BasePopup :is-visible="isScopeFormOpen" @close="closeScopeForm">
    <form id="add-scope-form" class="scope-form" @submit.prevent="submitNewScope()">
      <BaseInput
        v-model="newScopeName"
        id="scope-name"
        placeholder="Enter scope name"
        autocomplete="off"
        type="text"
        autofocus
      />

      <ColorPicker
        v-model:pureColor="newScopeColor"
        format="hex6"
        shape="circle"
        :z-index="10000"
        :disable-history="true"
        :disable-alpha="true"
        :is-widget="true"
      />

      <BaseButton type="submit">Add scope</BaseButton>
    </form>
  </BasePopup>
</template>

<script setup lang="ts">
import type { IScope } from '@/types';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore, usePopupsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const popupsStore = usePopupsStore();
const { isScopeFormOpen } = storeToRefs(popupsStore);
const { setMessage, setStatus, showToast } = commonStore;
const { createScope } = labelsStore;
const { closeScopeForm } = popupsStore;

const newScopeName = ref<string>('');
const newScopeColor = ref<string>('#000000');
const newScopeSchemas = {
  name: string().required('Please enter scope name').label('Scope name'),
  color: string().required('Please choose scope color').label('Scope color'),
};

watch(isScopeFormOpen, (isOpen) => {
  if (!isOpen) {
    resetForm();
  }
});

const resetForm = () => {
  newScopeName.value = '';
  newScopeColor.value = '#000000';
};

const submitNewScope = () => {
  try {
    newScopeSchemas.name.validateSync(newScopeName.value);
    newScopeSchemas.color.validateSync(newScopeColor.value);

    const newScope: IScope = {
      id: uuidv4(),
      name: newScopeName.value,
      color: newScopeColor.value,
    };

    createScope(newScope);
    resetForm();
    closeScopeForm();
  } catch (error) {
    if (error instanceof Error) {
      setMessage(error.message);
      setStatus('error');
      showToast();
    } else {
      setMessage('Unknown error');
      setStatus('error');
      showToast();
    }
  }
};
</script>

<style scoped>
.scope-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}
</style>
