<template>
  <BaseSidebar :is-open="isSettingsOpen">
    <template #main>
      <div
        class="sticky top-0 mb-3 pt-4 px-3 font-bold text-2xl bg-neutral-50 text-neutral-700 z-10"
      >
        Settings
      </div>

      <div class="px-3">
        <form id="add-scope-form" @submit.prevent="submitNewScope(newScope)">
          <div class="mb-2 font-bold text-neutral-600">Add label scope</div>

          <div class="mb-2">
            <BaseInput
              v-model="newScope.name"
              id="scope-name"
              placeholder="Enter scope name"
              autocomplete="off"
              type="text"
            />
          </div>

          <div class="flex flex-col items-center">
            <ColorPicker
              v-model:pureColor="newScope.color"
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

        <form id="add-label-form" class="mt-10 mb-10" @submit.prevent="submitNewLabel(newLabelData)">
          <div class="mb-2 font-bold text-neutral-600">Add label</div>
          [SCOPE SELECTOR]
          <div class="mb-2">
            <BaseInput
              v-model="newLabelData.name"
              id="label-name"
              placeholder="Enter label name"
              autocomplete="off"
              type="text"
            />
          </div>

          <div class="flex flex-col items-center">
            <ColorPicker
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
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import type { IScope, ILabel } from '@/types';
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { string } from 'yup';
import { useCommonStore } from '@/stores';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

const commonStore = useCommonStore();
const { isSettingsOpen } = storeToRefs(commonStore);

const newScope = reactive<IScope>({
  name: '',
  color: '#000000',
});
const newScopeSchemas = {
  name: string().required('Please enter scope name').label('Scope name'),
  color: string().required('Please choose scope color').label('Scope color'),
};

const submitNewScope = (scope: IScope) => {
  try {
    newScopeSchemas.name.validateSync(scope.name);
    newScopeSchemas.color.validateSync(scope.color);

    console.log('new scope', scope);

    newScope.name = '';
    newScope.color = '';
  } catch (error) {
    console.log(error.message);
  }
};

const newLabelData = reactive<ILabel>({
  name: '',
  color: '#000000',
  scope: null,
});
const newLabelSchemas = {
  name: string().required('Please enter label name').label('Label name'),
  color: string().required('Please choose label color').label('Label color'),
};

const submitNewLabel = (label: ILabel) => {
  try {
    newLabelSchemas.name.validateSync(label.name);
    newLabelSchemas.color.validateSync(label.color);

    console.log('new label', label);

    newLabelData.name = '';
    newLabelData.color = '';
  } catch (error) {
    console.log(error.message);
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
