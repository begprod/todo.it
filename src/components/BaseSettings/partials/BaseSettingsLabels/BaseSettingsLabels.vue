<template>
  <form id="add-label-form" class="settings-labels-form" @submit.prevent="submitNewLabel()">
    <BaseSelect
      id="label-name"
      v-model="newLabelScopeTitle"
      :options="scopesNames"
      placeholder="Choose label"
      @update:modelValue="chooseLabelScopeHandler($event)"
    />

    <div
      v-if="newLabelScopeTitle"
      class="settings-labels-scope"
      :style="{ backgroundColor: newLabelColor }"
    >
      {{ newLabelName }}
    </div>

    <BaseInput
      v-model="newLabelName"
      id="label-name"
      placeholder="Enter label name"
      autocomplete="off"
      type="text"
    />

    <ColorPicker
      v-if="!newLabelScopeTitle"
      v-model:pureColor="newLabelColor"
      format="hex6"
      shape="circle"
      :z-index="9"
      :disable-history="true"
      :disable-alpha="true"
      :is-widget="true"
    />

    <BaseButton type="submit"> Add label </BaseButton>
  </form>

  <template v-if="getGroupedLabels.length > 0">
    <BaseLabelList
      title="Labels"
      :labels="getGroupedLabels"
      :show-label-action-menu="true"
      @open-action-menu="showLabelActionMenu"
    />
  </template>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore } from '@/stores';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { setMessage, setStatus, setCurrentEditingLabel, showToast, openLabelActionMenu } =
  commonStore;
const { getSortedScopes, getGroupedLabels } = storeToRefs(labelsStore);
const { createLabel } = labelsStore;

const newLabelName = ref<string>('');
const newLabelColor = ref<string>('#000000');
const newLabelScopeTitle = ref<string | null>(null);
const scopesNames = computed(() => getSortedScopes.value.map((scope) => scope.name));
const newLabelSchemas = {
  name: string().required('Please enter label name').label('Label name'),
  color: string().required('Please choose label color').label('Label color'),
};

const chooseLabelScopeHandler = (scopeName: IScope['name']) => {
  const findScope = getSortedScopes.value.find((scope) => scope?.name === scopeName);

  if (!findScope) {
    newLabelColor.value = '#000000';
  }

  newLabelColor.value = findScope?.color ? findScope.color : '#000000';
};

const submitNewLabel = () => {
  try {
    newLabelSchemas.name.validateSync(newLabelName.value);
    newLabelSchemas.color.validateSync(newLabelColor.value);

    const newLabel: ILabel = {
      id: uuidv4(),
      name: newLabelName.value,
      color: newLabelColor.value,
      scopeTitle: newLabelScopeTitle.value,
    };

    createLabel(newLabel);

    newLabelName.value = '';
    newLabelColor.value = '#000000';
    newLabelScopeTitle.value = null;
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
.settings-labels-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-labels-scope {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
  font-size: var(--typo-size-sm);
  color: var(--color-typo-secondary);
  border-radius: var(--rounded-xl);
  word-break: break-all;
}
</style>
