<template>
  <BasePopup :is-visible="isLabelFormOpen" @close="closeLabelForm">
    <form id="add-label-form" class="label-form" @submit.prevent="submitNewLabel()">
      <BaseSelect
        id="label-name"
        v-model="newLabelScopeTitle"
        :options="scopesNames"
        placeholder="Choose label"
        @update:modelValue="chooseLabelScopeHandler($event)"
      />

      <div
        v-if="newLabelScopeTitle"
        class="label-form__preview"
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
        autofocus
      />

      <ColorPicker
        v-if="!newLabelScopeTitle"
        v-model:pureColor="newLabelColor"
        format="hex6"
        shape="circle"
        :z-index="10000"
        :disable-history="true"
        :disable-alpha="true"
        :is-widget="true"
      />

      <BaseButton type="submit">Add label</BaseButton>
    </form>
  </BasePopup>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore, usePopupsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const popupsStore = usePopupsStore();
const { isLabelFormOpen } = storeToRefs(popupsStore);
const { getSortedScopes } = storeToRefs(labelsStore);
const { setMessage, setStatus, showToast } = commonStore;
const { createLabel } = labelsStore;
const { closeLabelForm } = popupsStore;

const newLabelName = ref<string>('');
const newLabelColor = ref<string>('#000000');
const newLabelScopeTitle = ref<string | null>(null);
const scopesNames = computed(() => getSortedScopes.value.map((scope) => scope.name));
const newLabelSchemas = {
  name: string().required('Please enter label name').label('Label name'),
  color: string().required('Please choose label color').label('Label color'),
};

watch(isLabelFormOpen, (isOpen) => {
  if (!isOpen) {
    resetForm();
  }
});

const resetForm = () => {
  newLabelName.value = '';
  newLabelColor.value = '#000000';
  newLabelScopeTitle.value = null;
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
    resetForm();
    closeLabelForm();
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
.label-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.label-form__preview {
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
