<template>
  <Transition>
    <div v-if="isVisible" class="fixed bottom-0 w-full lg:items-center z-[9999]">
      <div
        class="min-w-full lg:min-w-[500px] p-2 text-neutral-600 rounded-md rounded-bl-none rounded-br-none bg-white z-50"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-80 z-[9998]"
      @click="closeHandler"
    />
  </Transition>
</template>

<script setup lang="ts">
interface IProps {
  isVisible?: boolean;
}

withDefaults(defineProps<IProps>(), {
  isVisible: false,
});

const emits = defineEmits(['close']);

const closeHandler = () => {
  emits('close');
};
</script>

<style scoped lang="scss">
.v {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(50px);
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
