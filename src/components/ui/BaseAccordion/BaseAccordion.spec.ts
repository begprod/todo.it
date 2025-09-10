import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

describe('BaseAccordion', () => {
  const wrapper = mount(BaseAccordion, {
    global: {
      components: {
        BaseButton,
        ChevronDown,
        ChevronUp,
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

  it('should add class "accordion_open" if props isOpen true', async () => {
    const button = wrapper.find('button[title="Collapse/Expand"]');

    await button.trigger('click');

    expect(wrapper.classes()).toContain('accordion_open');
  });

  it('should add class "accordion_header_sticky" if props isHeaderSticky true', async () => {
    await wrapper.setProps({ isHeaderSticky: true });

    expect(wrapper.classes()).toContain('accordion_header_sticky');
  });

  it('should contain slots content', async () => {
    const title = wrapper.find('.accordion__title');
    const action = wrapper.find('.accordion__controls');

    expect(title.text()).toBe('Test title');
    expect(action.html()).toContain('Test action');
    expect(wrapper.html()).toContain('Test content');
  });

  it('should contain icons component', async () => {
    const button = wrapper.find('button[title="Collapse/Expand"]');

    await button.trigger('click');

    expect(wrapper.findComponent(ChevronDown).exists()).toBe(true);

    await button.trigger('click');

    expect(wrapper.findComponent(ChevronUp).exists()).toBe(true);
  });

  it('should emit click event', async () => {
    const button = wrapper.find('button[title="Collapse/Expand"]');

    await button.trigger('click');

    expect(wrapper.emitted().click).toBeTruthy();
  });
});
