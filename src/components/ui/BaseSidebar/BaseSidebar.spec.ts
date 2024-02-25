import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  const wrapper = mount(BaseSidebar, {
    slots: {
      default: '<div>Slot content</div>',
    },
  });

  it('should render slot content', () => {
    expect(wrapper.html()).toContain('Slot content');
  });
});
