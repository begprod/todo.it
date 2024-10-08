import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  const wrapper = mount(BaseSidebar, {
    props: {
      isOpen: false,
      side: 'left',
    },
    slots: {
      main: '<div>Slot content</div>',
      footer: '<div>Footer content</div>',
    },
  });

  it('should not render slot content when isOpen is false', () => {
    expect(wrapper.html()).not.toContain('Slot content');
  });

  it('should add right class when side is right', async () => {
    await wrapper.setProps({ isOpen: true, side: 'right' });

    expect(wrapper.classes()).toContain('right-0');
  });

  it('should add left class when side is left', async () => {
    await wrapper.setProps({ isOpen: true, side: 'left' });

    expect(wrapper.classes()).toContain('left-0');
  });

  it('should render slots content when isOpen is true', async () => {
    await wrapper.setProps({ isOpen: true });

    expect(wrapper.html()).toContain('Slot content');
    expect(wrapper.html()).toContain('Footer content');
  });
});
