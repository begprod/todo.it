import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';

describe('BasePopup', () => {
  const wrapper = mount(BasePopup, {
    props: {
      isVisible: true,
    },
    slots: {
      default: 'Slot content',
    },
  });

  it('should showing popup when prop isVisible is true', () => {
    expect(wrapper.html()).toContain('fixed bottom-0 w-full lg:items-center z-[9999]');
    expect(wrapper.html()).toContain(
      'fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-80 z-[9998]',
    );

    expect(wrapper.html()).toContain('Slot content');
  });

  it('should hiding popup when prop isVisible is false', async () => {
    await wrapper.setProps({ isVisible: false });

    expect(wrapper.html()).not.toContain('fixed bottom-0 w-full lg:items-center z-[9999]');
    expect(wrapper.html()).not.toContain(
      'fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-80 z-[9998]',
    );

    expect(wrapper.html()).not.toContain('Slot content');
  });

  it('should emit click on popup backdrop', async () => {
    await wrapper.setProps({ isVisible: true });

    await wrapper.find('.fixed.top-0').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('close');
  });
});
