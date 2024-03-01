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
    },
    slots: {
      title: '<div>Test title</div>',
      action: '<div>Test action</div>',
      content: '<div>Test content</div>',
    },
  });

  it('should passed id props', async () => {
    expect(wrapper.html()).toContain('test_id');
  });

  it('should passed additionalClasses prop', async () => {
    await wrapper.setProps({ additionalClasses: 'test_class' });

    expect(wrapper.html()).toContain('test_class');
  });

  it('should contain slots content when click on button', async () => {
    const button = wrapper.find('button[title="Collapse/Expand"]');

    await button.trigger('click');

    expect(wrapper.html()).toContain('Test title');
    expect(wrapper.html()).toContain('Test action');
    expect(wrapper.html()).toContain('Test content');
  });

  it('should contain icons component', async () => {
    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(true);
  });

  it('should emit click event', async () => {
    const button = wrapper.find('button[title="Collapse/Expand"]');

    await button.trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();
  });
});
