import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';

describe('BaseAccordion', () => {
  const wrapper = mount(BaseAccordion, {
    props: {
      id: 'test_id',
      title: 'test_title',
    },
    slots: {
      default: '<div>Test slot</div>',
    },
  });

  it('should passed id, title props', async () => {
    expect(wrapper.html()).toContain('test_id');
    expect(wrapper.html()).toContain('test_title');
  });

  it('should passed additionalClasses prop', async () => {
    await wrapper.setProps({ additionalClasses: 'test_class' });

    expect(wrapper.html()).toContain('test_class');
  });

  it('should render pin when passed isActive prop', async () => {
    await wrapper.setProps({ isActive: true });

    expect(wrapper.html()).toContain(
      'shrink-0 w-3 h-3 lg:w-4 lg:h-4 mr-3 lg:mr-5 rounded-full bg-green-500',
    );
  });

  it('should render slot content when passed isOpen prop', async () => {
    await wrapper.find('#test_id').trigger('click');

    expect(wrapper.html()).toContain('Test slot');
  });

  it('should emit click event', async () => {
    await wrapper.find('#test_id').trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();
  });
});
