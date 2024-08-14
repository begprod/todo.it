<template>
  <BaseSidebar :is-open="isSettingsOpen">
    <template #main>
      <div
        class="sticky top-0 mb-3 pt-4 px-3 font-bold text-2xl bg-neutral-50 text-neutral-700 z-10"
      >
        Settings
      </div>

      <div class="px-3">
        <form id="add-scope-form" @submit.prevent="submitNewScope()">
          <div class="mb-2 font-bold text-neutral-600">Add label scope</div>

          <div class="mb-2">
            <BaseInput
              v-model="newScopeName"
              id="scope-name"
              placeholder="Enter scope name"
              autocomplete="off"
              type="text"
            />
          </div>

          <div class="flex flex-col items-center">
            <ColorPicker
              v-model:pureColor="newScopeColor"
              class="test"
              format="hex6"
              shape="circle"
              :z-index="9"
              :disable-history="true"
              :disable-alpha="true"
              :is-widget="true"
            />
          </div>

          <BaseButton class="w-full mt-2" type="submit"> Add scope </BaseButton>
        </form>

        <div v-if="getAllScopes.length > 0" class="flex flex-wrap gap-2 mb-8 mt-4">
          <BaseLabel
            v-for="scope in getAllScopes"
            :key="scope.id"
            :title="scope.name"
            :color="scope.color"
          />
        </div>

        <form id="add-label-form" class="mt-10 mb-10" @submit.prevent="submitNewLabel()">
          <div class="mb-2 font-bold text-neutral-600">Add label</div>
          [SCOPE SELECTOR]
          <div class="mb-2">
            <BaseInput
              v-model="newLabelName"
              id="label-name"
              placeholder="Enter label name"
              autocomplete="off"
              type="text"
            />
          </div>

          <div class="flex flex-col items-center">
            <ColorPicker
              v-model:pureColor="newLabelColor"
              class="test"
              format="hex6"
              shape="circle"
              :z-index="9"
              :disable-history="true"
              :disable-alpha="true"
              :is-widget="true"
            />
          </div>

          <BaseButton class="w-full mt-3" type="submit"> Add label </BaseButton>
        </form>

        <div v-if="getAllLabels.length > 0" class="flex flex-wrap gap-2 mb-8 mt-4">
          <BaseLabel
            v-for="label in getAllLabels"
            :key="label.id"
            :title="label.name"
            :color="label.color"
          />
        </div>
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import uniqid from 'uniqid';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore } from '@/stores';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseLabel from '@/components/ui/BaseLabel/BaseLabel.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { isSettingsOpen } = storeToRefs(commonStore);
const { setMessage, setStatus, showToast } = commonStore;
const { createScope, createLabel, getAllScopes, getAllLabels } = labelsStore;

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
      id: uniqid(),
      name: newScopeName.value,
      color: newScopeColor.value,
    };

    createScope(newScope);

    newScopeName.value = '';
    newScopeColor.value = '#000000';
  } catch (error) {
    // @ts-ignore
    setMessage(error.message);
    setStatus('error');
    showToast();
  }
};

const newLabelName = ref<string>('');
const newLabelColor = ref<string>('#000000');
// const newLabelScope = ref<IScope | null>(null);
const newLabelSchemas = {
  name: string().required('Please enter label name').label('Label name'),
  color: string().required('Please choose label color').label('Label color'),
};

const submitNewLabel = () => {
  try {
    newLabelSchemas.name.validateSync(newLabelName.value);
    newLabelSchemas.color.validateSync(newLabelColor.value);

    const newLabel: ILabel = {
      id: uniqid(),
      name: newLabelName.value,
      color: newLabelColor.value,
      scope: null,
    };

    createLabel(newLabel);

    newLabelName.value = '';
    newLabelColor.value = '#000000';
    // newLabelScope.value = null;
  } catch (error) {
    // @ts-ignore
    setMessage(error.message);
    setStatus('error');
    showToast();
  }
};
</script>

<style lang="scss">
.vc-colorpicker {
  @apply border border-slate-300 w-full shadow-none #{!important};
}

.vc-input-toggle {
  display: none !important;
}
</style>
