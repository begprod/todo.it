import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';

describe('BaseContentEditableInput', () => {
  const wrapper = mount(BaseContentEditableInput, {
    props: {
      modelValue: '',
      isContentEditable: true,
      isRequired: false,
      title: 'test',
      placeholder: 'test',
      textSize: 'sm',
      fontWeight: 'normal',
    },
  });

  it('should set props', async () => {
    expect(wrapper.find('.contenteditable-field').attributes('contenteditable')).toBe('true');
    expect(wrapper.find('.contenteditable-field').attributes('title')).toBe('test');
    expect(wrapper.find('.contenteditable-field').attributes('data-placeholder')).toBe('test');

    await wrapper.setProps({
      isContentEditable: 'plaintext-only',
    });

    expect(wrapper.find('.contenteditable-field').attributes('contenteditable')).toBe(
      'plaintext-only',
    );
  });

  it('should set css classes', async () => {
    await wrapper.setProps({
      isContentEditable: true,
    });

    expect(wrapper.find('.contenteditable-field').classes()).toContain('is-active-placeholder');

    await wrapper.setProps({
      isContentEditable: false,
    });

    expect(wrapper.find('.contenteditable-field').classes()).not.toContain('is-active-placeholder');
    expect(wrapper.find('.contenteditable-field').classes()).toContain('opacity-60');

    await wrapper.setProps({
      textSize: 'lg',
      fontWeight: 'semibold',
    });

    expect(wrapper.find('.contenteditable-field').classes()).not.toContain('text-sm');
    expect(wrapper.find('.contenteditable-field').classes()).toContain('lg:text-lg');
    expect(wrapper.find('.contenteditable-field').classes()).not.toContain('font-normal');
    expect(wrapper.find('.contenteditable-field').classes()).toContain('font-semibold');
  });

  it('should emit events', async () => {
    await wrapper.find('.contenteditable-field').trigger('input');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).toHaveProperty('input');

    await wrapper.find('.contenteditable-field').trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('blur');

    wrapper.vm.$emit('keydown.esc');

    expect(wrapper.emitted()).toHaveProperty('keydown.esc');
  });
});
