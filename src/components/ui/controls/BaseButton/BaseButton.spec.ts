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

  it('should set attribute', async () => {
    expect(wrapper.attributes().class).toBe(
      'button button_variant_default button_color_default button_background_default',
    );

    await wrapper.setProps({ type: 'reset' });

    expect(wrapper.attributes('type')).toBe('reset');
  });

  it('should set variants class', async () => {
    await wrapper.setProps({
      variant: 'action',
    });

    expect(wrapper.attributes().class).toContain('button_variant_action');
  });

  it('should set text colors class', async () => {
    await wrapper.setProps({
      color: 'alert',
    });

    expect(wrapper.attributes().class).toContain('button_color_alert');

    await wrapper.setProps({
      color: 'success',
    });

    expect(wrapper.attributes().class).toContain('button_color_success');

    await wrapper.setProps({
      color: 'secondary',
    });

    expect(wrapper.attributes().class).toContain('button_color_secondary');
  });

  it('should set background class', async () => {
    await wrapper.setProps({
      background: 'alert',
    });

    expect(wrapper.attributes().class).toContain('button_background_alert');
  });

  it('should set prop title', async () => {
    await wrapper.setProps({ title: 'test' });

    expect(wrapper.attributes('title')).toBe('test');
  });

  it('should render default slot', async () => {
    expect(wrapper.text()).toContain('default slot');
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
