<template>
  <BaseSidebar :is-open="isSettingsOpen" side="right">
    <template #main>
      <div class="settings">
        <div class="settings__header">
          <BaseButton
            class="settings__header-collapse"
            title="Collapse/Expand settings sidebar"
            @click="toggleSettings"
            data-test-id="toggle-settings-button"
          >
            <PanelRightClose class="icon icon_sm" />
          </BaseButton>

          Settings
        </div>
      </div>

      <div class="setting__panels">
        <div class="settings-panel">
          <BaseAccordion>
            <template #title>
              <span class="settings-panel__title">Label's scopes</span>
            </template>

            <template #content>
              <form
                id="add-scope-form"
                class="settings-panel__form"
                @submit.prevent="submitNewScope()"
              >
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
          </BaseAccordion>
        </div>

        <div class="settings-panel">
          <BaseAccordion>
            <template #title>
              <span class="settings-panel__title">Labels</span>
            </template>

            <template #content>
              <form
                id="add-label-form"
                class="settings-panel__form"
                @submit.prevent="submitNewLabel()"
              >
                <BaseSelect
                  id="scope-name"
                  v-model="newLabelScopeTitle"
                  :options="scopesNames"
                  placeholder="Choose scope"
                  @update:modelValue="chooseLabelScopeHandler($event)"
                />

                <div
                  v-if="newLabelScopeTitle"
                  class="settings-panel__scope"
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
          </BaseAccordion>
        </div>

        <div class="settings-panel">
          <BaseAccordion>
            <template #title>
              <span class="settings-panel__title">Backup data</span>
            </template>

            <template #content>
              <BaseButton
                @click="exportDataFromLocalStorage(['todo:scopes', 'todo:labels', 'todo.it:tasks'])"
                data-test-id="export-data-button"
              >
                <template #leftIcon>
                  <FileUp class="icon icon_md" />
                </template>
                Export
              </BaseButton>
              <BaseButton @click="importDataHandler" data-test-id="import-data-button">
                <template #leftIcon>
                  <FileDown class="icon icon_md" />
                </template>
                Import
              </BaseButton>
            </template>
          </BaseAccordion>
        </div>
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
import { PanelRightClose, FileDown, FileUp } from 'lucide-vue-next';
import { useCommonStore, useLabelsStore } from '@/stores';
import { exportDataFromLocalStorage, importDataToLocalStorage } from '@/helpers';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
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
const { getSortedScopes, getGroupedLabels } = storeToRefs(labelsStore);
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

const importDataHandler = async () => {
  await importDataToLocalStorage()
    .then(() => {
      location.reload();
    })
    .catch(() => {
      setMessage('Something went wrong while importing data');
      setStatus('error');
      showToast();
    });
};

defineExpose({
  submitNewScope,
  submitNewLabel,
  importDataHandler,
});
</script>

<style scoped>
.settings {
  position: sticky;
  top: 0;
  margin-bottom: 0.75rem;
  padding: 1rem;
  font-size: var(--typo-size-2xl);
  font-weight: 700;
  background-color: var(--color-bg-surface-trinary);
  z-index: 10;
}

.settings__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings__header-collapse {
  width: auto;
}

.setting__panels {
  padding: 0 1rem;
}

.settings-panel__title {
  font-weight: 600;
}

.settings-panel__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-panel__scope {
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
