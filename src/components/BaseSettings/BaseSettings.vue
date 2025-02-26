<template>
  <BaseSidebar :is-open="isSettingsOpen" side="right">
    <template #main>
      <div
        class="sticky top-0 mb-3 pt-4 px-3 font-bold text-2xl bg-neutral-50 text-neutral-700 z-10"
      >
        <div class="flex items-center mb-6">
          <BaseButton
            class="!w-auto mr-2"
            title="Collapse/Expand settings sidebar"
            @click="toggleSettings"
            data-test-id="toggle-settings-button"
          >
            <PanelRightClose class="w-4 h-4" />
          </BaseButton>

          Settings
        </div>
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

            <template v-if="getAllScopes.length > 0">
              <BaseLabelList
                title="Scopes"
                :labels="getAllScopes"
                :show-label-action-menu="true"
                @open-action-menu="showLabelActionMenu"
              />
            </template>
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
                class="w-full min-h-10 flex items-center justify-center mb-2 p-2 text-white rounded-xl break-all"
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

            <template v-if="getAllLabels.length > 0">
              <BaseLabelList
                title="Labels"
                :labels="getAllLabels"
                :show-label-action-menu="true"
                @open-action-menu="showLabelActionMenu"
              />
            </template>
          </template>
        </BaseAccordion>
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { PanelRightClose } from 'lucide-vue-next';
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
const {
  setMessage,
  setStatus,
  showToast,
  setCurrentEditingLabel,
  openLabelActionMenu,
  toggleSettings,
} = commonStore;
const { getAllScopes, getAllLabels } = storeToRefs(labelsStore);
const { createScope, createLabel } = labelsStore;

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
    // TODO: error type
    // @ts-ignore
    setMessage(error.message);
    setStatus('error');
    showToast();
  }
};

const scopesNames = computed(() => getAllScopes.value.map((scope) => scope.name).sort());

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
    // @ts-ignore
    setMessage(error.message);
    setStatus('error');
    showToast();
  }
};

const showLabelActionMenu = (label: ILabel) => {
  setCurrentEditingLabel(label);

  openLabelActionMenu();
};

defineExpose({
  submitNewScope,
  submitNewLabel,
});
</script>

<style lang="scss">
.vc-colorpicker {
  @apply border border-slate-300 w-full shadow-none #{!important};
}

.vc-input-toggle {
  display: none !important;
}
</style>
