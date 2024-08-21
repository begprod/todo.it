<template>
  <BaseSidebar :is-open="isSettingsOpen">
    <template #main>
      <div
        class="sticky top-0 mb-3 pt-4 px-3 font-bold text-2xl bg-neutral-50 text-neutral-700 z-10"
      >
        Settings
      </div>

      <div class="px-3">
        <BaseAccordion>
          <template #title>
            <span class="font-semibold">Label's scopes</span>
          </template>

          <template #content>
            <form id="add-scope-form" @submit.prevent="submitNewScope()">
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

            <div v-if="getAllScopes.length > 0" class="flex flex-wrap gap-2 mt-4">
              <BaseLabelList title="Scopes" :labels="getAllScopes" />
            </div>
          </template>
        </BaseAccordion>

        <BaseAccordion>
          <template #title>
            <span class="font-semibold">Labels</span>
          </template>

          <template #content>
            <form id="add-label-form" @submit.prevent="submitNewLabel()">
              <BaseSelect
                id="scope-name"
                class="w-full mb-2"
                v-model="newLabelScopeTitle"
                :options="scopesNames"
                placeholder="Choose scope"
                @update:modelValue="chooseLabelScopeHandler($event)"
              />

              <div
                v-if="newLabelScopeTitle"
                class="w-full h-10 flex items-center justify-center mb-2 text-white rounded-xl"
                :style="{ backgroundColor: newLabelColor }"
              >
                {{ newLabelName }}
              </div>

              <div class="mb-2">
                <BaseInput
                  v-model="newLabelName"
                  id="label-name"
                  placeholder="Enter label name"
                  autocomplete="off"
                  type="text"
                />
              </div>

              <div v-if="!newLabelScopeTitle" class="flex flex-col items-center">
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

            <div v-if="getAllLabels.length > 0" class="flex flex-wrap gap-2 mt-4">
              <BaseLabelList title="Labels" :labels="getAllLabels" />
            </div>
          </template>
        </BaseAccordion>
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import uniqid from 'uniqid';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { useCommonStore, useLabelsStore } from '@/stores';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { isSettingsOpen } = storeToRefs(commonStore);
const { setMessage, setStatus, showToast } = commonStore;
const { getAllScopes, getAllLabels } = storeToRefs(labelsStore);
const { createScope, createLabel, deleteScope, deleteLabel } = labelsStore;

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
    // TODO: error type
    // @ts-ignore
    setMessage(error.message);
    setStatus('error');
    showToast();
  }
};

const scopesNames = computed(() => getAllScopes.value.map((scope) => scope.name));

const newLabelName = ref<string>('');
const newLabelColor = ref<string>('#000000');
const newLabelScopeTitle = ref<string | null>(null);
const newLabelSchemas = {
  name: string().required('Please enter label name').label('Label name'),
  color: string().required('Please choose label color').label('Label color'),
};

const chooseLabelScopeHandler = (scopeName: IScope['name']) => {
  const findScope = getAllScopes.value.find((scope) => scope?.name === scopeName);

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
      id: uniqid(),
      name: newLabelName.value,
      color: newLabelColor.value,
      scopeTitle: newLabelScopeTitle.value,
    };

    createLabel(newLabel);

    newLabelName.value = '';
    newLabelColor.value = '#000000';
    newLabelScopeTitle.value = null;
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
