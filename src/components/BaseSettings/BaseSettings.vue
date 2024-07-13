<template>
  <BaseSidebar :is-open="isSettingsOpen">
    <template #main>
      <div
        class="sticky top-0 mb-3 pt-4 px-3 font-bold text-2xl bg-neutral-50 text-neutral-700 z-10"
      >
        Settings
      </div>

      <div class="px-3">
        <form id="add-label-form">
          <div class="mb-2 font-bold text-neutral-600">Add label scope</div>

          <div class="mb-2">
            <BaseInput
              id="scope-name"
              placeholder="Enter scope name"
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

          <BaseButton class="w-full mt-2"> Add scope </BaseButton>
        </form>

        <form id="add-label-form" class="mt-10 mb-10">
          <div class="mb-2 font-bold text-neutral-600">Add label</div>
          [SCOPE SELECTOR]
          <div class="mb-2">
            <BaseInput
              id="scope-name"
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

          <BaseButton class="w-full mt-3"> Add label </BaseButton>
        </form>
      </div>
    </template>
  </BaseSidebar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

const commonStore = useCommonStore();
const { isSettingsOpen } = storeToRefs(commonStore);
</script>

<style lang="scss">
.vc-colorpicker {
  @apply border border-slate-300 w-full shadow-none #{!important};
}

.vc-input-toggle {
  display: none !important;
}
</style>
