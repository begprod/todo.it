import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  const wrapper = mount(BaseSidebar, {
    props: {
      isOpen: false,
    },
    slots: {
      default: '<div>Slot content</div>',
    },
  });

  it('should not render slot content when isOpen is false', () => {
    expect(wrapper.html()).not.toContain('Slot content');
  });

  it('should render slot content when isOpen is true', async () => {
    await wrapper.setProps({ isOpen: true });

    expect(wrapper.html()).toContain('Slot content');
  });
});
