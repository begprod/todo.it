<template>
  <Transition>
    <div
      v-if="isVisible"
      class="fixed bottom-0 w-full lg:items-center z-[9999]"
      @keydown.esc="closeTaskActionMenu"
      data-test-id="popup-container"
    >
      <div
        class="min-w-full lg:min-w-[500px] p-2 text-neutral-600 rounded-md rounded-bl-none rounded-br-none bg-white z-50"
        data-test-id="popup-content"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-80 z-[9998]"
      @click="$emit('close')"
      data-testid="popup-backdrop"
    />
  </Transition>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores';

interface IProps {
  isVisible?: boolean;
}

withDefaults(defineProps<IProps>(), {
  isVisible: false,
});

defineEmits(['close']);

const commonStore = useCommonStore();
const { closeTaskActionMenu } = commonStore;

defineExpose({
  closeTaskActionMenu,
});
</script>

<style scoped lang="scss">
.v-enter {
  &-active {
    transition: all 0.5s ease;
  }

  &-from {
    opacity: 0;
    transform: translateY(50px);
  }
}

.v-leave {
  &-active {
    transition: all 0.5s ease;
  }

  &-to {
    opacity: 0;
    transform: translateY(50px);
  }
}

.fade-enter {
  &-active {
    transition: all 0.3s ease-out;
  }

  &-from {
    opacity: 0;
  }
}

.fade-leave {
  &-active {
    transition: all 0.3s ease-out;
  }

  &-to {
    opacity: 0;
  }
}
</style>
