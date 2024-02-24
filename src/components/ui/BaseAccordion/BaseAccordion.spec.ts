import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

describe('BaseAccordion', () => {
  const wrapper = mount(BaseAccordion, {
    global: {
      components: {
        BaseButton,
        ChevronDownIcon,
        ChevronUpIcon,
      },
    },
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

  it('should contain pin when passed isActive prop', async () => {
    await wrapper.setProps({ isActive: true });

    expect(wrapper.html()).toContain(
      'shrink-0 w-3 h-3 mr-3 rounded-full bg-green-500 animate-pulse select-none',
    );
  });

  it('should contain slot content when passed isOpen prop', async () => {
    const button = wrapper.find('button[title="Close/Open"]');

    await button.trigger('click');

    expect(wrapper.html()).toContain('Test slot');
  });

  it('should have icons component', async () => {
    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(true);
  });

  it('should emit click event', async () => {
    const button = wrapper.find('button[title="Close/Open"]');

    await button.trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();
  });
});
