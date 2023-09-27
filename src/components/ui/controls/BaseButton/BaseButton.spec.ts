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

  it('correct set prop type', async () => {
    expect(wrapper.find('button').attributes('type')).toBe('button');

    await wrapper.setProps({ type: 'reset' });

    expect(wrapper.find('button').attributes('type')).toBe('reset');
  });

  it('correct set prop title', async () => {
    await wrapper.setProps({ title: 'test' });

    expect(wrapper.find('button').attributes('title')).toBe('test');
  });

  it('correct render default slot', async () => {
    expect(wrapper.html()).toContain('test');
  });

  it('correct render left icon slot', async () => {
    expect(wrapper.html()).toContain('<svg></svg>');
  });

  it('correct render right icon slot', async () => {
    expect(wrapper.html()).toContain('<svg></svg>');
  });

  it('correct emit click event', async () => {
    await wrapper.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
