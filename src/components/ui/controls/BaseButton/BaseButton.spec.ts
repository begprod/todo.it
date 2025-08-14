import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';

describe('BaseButton', () => {
  const wrapper = mount(BaseButton, {
    slots: {
      default: 'default slot',
      leftIcon: '<svg></svg>',
      rightIcon: '<svg></svg>',
    },
  });

  it('should set prop type', async () => {
    expect(wrapper.find('button').attributes('type')).toBe('button');

    await wrapper.setProps({ type: 'reset' });

    expect(wrapper.find('button').attributes('type')).toBe('reset');
  });

  it('should set prop title', async () => {
    await wrapper.setProps({ title: 'test' });

    expect(wrapper.find('button').attributes('title')).toBe('test');
  });

  it('should render default slot', async () => {
    expect(wrapper.html()).toContain('test');
  });

  it('should render left icon slot', async () => {
    const iconEl = wrapper.find('.button__icon-left');

    expect(iconEl.exists()).toBe(true);
    expect(wrapper.html()).toContain('<svg></svg>');
  });

  it('should render right icon slot', async () => {
    const iconEl = wrapper.find('.button__icon-right');

    expect(iconEl.exists()).toBe(true);
    expect(wrapper.html()).toContain('<svg></svg>');
  });

  it('should emit click event', async () => {
    await wrapper.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
