<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[272px] z-50">
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="flex items-center w-full sm:w-full max-w-xs p-4 bg-white rounded-lg shadow-sm shadow-slate-300 duration-300 hover:shadow-lg"
        :class="classObject"
        @click="onClick"
        data-test-id="toast"
      >
        <div
          v-if="props.type === 'success'"
          class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-200 rounded-lg"
          data-test-id="toast-success-icon"
        >
          <HandThumbUpIcon class="w-5 h-5" />
        </div>
        <div
          v-if="props.type === 'error'"
          class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-red-200 rounded-lg"
          data-test-id="toast-error-icon"
        >
          <ExclamationTriangleIcon class="w-5 h-5" />
        </div>

        <div class="flex flex-col items-start ml-3">
          <div class="text-sm font-normal" data-test-id="toast-message">{{ message }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { HandThumbUpIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';

interface IProps {
  type?: string;
  message: string;
  isVisible: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(['click']);

const classObject = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
});

const onClick = () => {
  emit('click');
};
</script>

<style lang="scss" scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
