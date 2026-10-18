<template>
  <form id="add-scope-form" class="settings-scopes-form" @submit.prevent="submitNewScope()">
    <BaseInput
      v-model="newScopeName"
      id="scope-name"
      placeholder="Enter scope name"
      autocomplete="off"
      type="text"
    />

    <ColorPicker
      v-model:pureColor="newScopeColor"
      format="hex6"
      shape="circle"
      :z-index="9"
      :disable-history="true"
      :disable-alpha="true"
      :is-widget="true"
    />

    <BaseButton type="submit"> Add scope </BaseButton>
  </form>

  <template v-if="getSortedScopes.length > 0">
    <BaseLabelList
      title="Scopes"
      :labels="getSortedScopes"
      :show-label-action-menu="true"
      @open-action-menu="showLabelActionMenu"
    />
  </template>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore } from '@/stores';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { setMessage, setStatus, setCurrentEditingLabel, showToast, openLabelActionMenu } =
  commonStore;
const { getSortedScopes } = storeToRefs(labelsStore);
const { createScope } = labelsStore;

const newScopeName = ref<string>('');
const newScopeColor = ref<string>('#000000');
const newScopeSchemas = {
  name: string().required('Please enter scope name').label('Scope name'),
  color: string().required('Please choose scope color').label('Scope color'),
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

    newScopeName.value = '';
    newScopeColor.value = '#000000';
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

const showLabelActionMenu = (label: ILabel) => {
  setCurrentEditingLabel(label);

  openLabelActionMenu();
};
</script>

<style scoped>
.settings-scopes-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
