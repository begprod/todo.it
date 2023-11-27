import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';

describe('BaseContentEditableInput', () => {
  const wrapper = mount(BaseContentEditableInput, {
    props: {
      modelValue: '',
      isContenteditable: true,
      title: 'test',
      placeholder: 'test',
    },
  });

  it('should have css classes', async () => {
    expect(wrapper.find('.contenteditable-field').classes()).toContain('theme_typo_default');
    expect(wrapper.find('.contenteditable-field').classes()).toContain('contenteditable-field');

    await wrapper.setProps({
      isContenteditable: false,
    });

    expect(wrapper.find('.contenteditable-field').classes()).toContain('opacity-60');
  });

  it('should set props', async () => {
    await wrapper.setProps({
      isContenteditable: true,
    });

    expect(wrapper.find('.contenteditable-field').attributes('contenteditable')).toBe('true');
    expect(wrapper.find('.contenteditable-field').attributes('title')).toBe('test');
    expect(wrapper.find('.contenteditable-field').attributes('data-placeholder')).toBe('test');
    expect(wrapper.find('.contenteditable-field').attributes('contenteditable')).toBe('true');
  });

  it('should emit mouseover event', async () => {
    const wrapper = mount(BaseContentEditableInput, {
      props: {
        modelValue: '- asdasdasd \n [https://google.com](https://google.com)',
        isContenteditable: true,
        title: 'test',
        placeholder: 'test',
      },
    });

    await wrapper.find('.contenteditable-field').find('a').trigger('mouseover');

    expect(wrapper.emitted()).toHaveProperty('mouseover');
  });

  it('should emit focus events', async () => {
    await wrapper.find('.contenteditable-field').trigger('focus');

    expect(wrapper.emitted()).toHaveProperty('focus');
  });

  it('should emit input events', async () => {
    await wrapper.find('.contenteditable-field').trigger('input');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).toHaveProperty('input');
  });

  it('should emit blur events', async () => {
    await wrapper.find('.contenteditable-field').trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('blur');
  });

  it('should emit keydown escape events', async () => {
    wrapper.vm.$emit('keydown.esc');
    expect(wrapper.emitted()).toHaveProperty('keydown.esc');
  });

  it('should render markdown', async () => {
    const wrapper = mount(BaseContentEditableInput, {
      props: {
        modelValue: '# test',
        isContenteditable: true,
        title: 'test',
        placeholder: 'test',
      },
    });

    expect(wrapper.html()).toContain('<h1>test</h1>');
  });

  it('should render markdown todo list', async () => {
    const wrapper = mount(BaseContentEditableInput, {
      props: {
        modelValue: '- [ ] test \n - [x] test',
        isContenteditable: true,
        title: 'test',
        placeholder: 'test',
      },
    });

    expect(wrapper.html()).toContain('contains-task-list');
    expect(wrapper.html()).toContain('task-list-item');
    expect(wrapper.html()).toContain('task-list-item-checkbox');
    expect(wrapper.html()).toContain('checked');
  });
});
