<template>
  <div class="settings">
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
                id="label-name"
                v-model="newLabelScopeTitle"
                :options="scopesNames"
                placeholder="Choose label"
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
            <span class="settings-panel__title">View type</span>
          </template>

          <template #content>
            <div class="setting__panels__controls">
              <BaseButton
                :variant="currentViewType === 'rows' ? 'active' : 'default'"
                @click="setViewType('rows')"
                data-test-id="view-type-rows-button"
              >
                <template #leftIcon>
                  <Rows3 class="icon icon_md" />
                </template>
                Rows
              </BaseButton>

              <BaseButton
                :variant="currentViewType === 'columns' ? 'active' : 'default'"
                @click="setViewType('columns')"
                data-test-id="view-type-columns-button"
              >
                <template #leftIcon>
                  <Columns3 class="icon icon_md" />
                </template>
                Columns
              </BaseButton>
            </div>
          </template>
        </BaseAccordion>
      </div>

      <div class="settings-panel">
        <BaseAccordion>
          <template #title>
            <span class="settings-panel__title">Backup data</span>
          </template>

          <template #content>
            <div class="setting__panels__controls">
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
            </div>
          </template>
        </BaseAccordion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { FileDown, FileUp, Columns3, Rows3 } from 'lucide-vue-next';
import { useCommonStore, useLabelsStore } from '@/stores';
import { exportDataFromLocalStorage, importDataToLocalStorage } from '@/helpers';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/ui/controls/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

const commonStore = useCommonStore();
const labelsStore = useLabelsStore();
const { currentViewType } = storeToRefs(commonStore);
const {
  setMessage,
  setStatus,
  setViewType,
  setCurrentEditingLabel,
  showToast,
  openLabelActionMenu,
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
  width: 100%;
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
