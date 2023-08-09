import type { DirectiveBinding } from 'vue';

export const clickOutside = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const handleClickOutside = (event: MouseEvent) => {
      if (el.contains(event.target as Node)) {
        return;
      }

      binding.value();
    };

    document.addEventListener('click', handleClickOutside);
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    document.removeEventListener('click', binding.value);
  },
};
