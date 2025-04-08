import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@/components/ui/controls/BaseInput/BaseInput.vue';

describe('BaseInput', () => {
  let wrapper: ComponentWrapperType<typeof BaseInput>;

  const createComponent = () => {
    wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        id: 'test id',
        type: 'text',
        placeholder: 'test placeholder',
        dataTestId: 'test-id',
        autocomplete: 'true',
        autofocus: false,
        isError: false,
      },
      slots: {
        'icon-left': '<div class="icon-left">test</div>',
        'icon-right': '<div class="icon-right">test</div>',
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should contain the correct props', () => {
    expect(wrapper.props().modelValue).toBe('');
    expect(wrapper.props().id).toBe('test id');
    expect(wrapper.props().type).toBe('text');
    expect(wrapper.props().placeholder).toBe('test placeholder');
    expect(wrapper.props().dataTestId).toBe('test-id');
    expect(wrapper.props().autocomplete).toBe('true');
    expect(wrapper.props().autofocus).toBe(false);
    expect(wrapper.props().isError).toBe(false);
  });

  it('should contain correct css class if isError is true', async () => {
    await wrapper.setProps({ isError: true });

    expect(wrapper.html()).toContain('!border-red-500 !focus:border-red-500');
  });

  it('should update model value', async () => {
    const input = wrapper.find('input');

    input.setValue('test value');

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(input.element.value).toBe('test value');
  });

  it('should emit onFocus event', async () => {
    const input = wrapper.find('input');

    await input.trigger('focus');

    expect(wrapper.emitted().onFocus).toBeTruthy();
  });

  it('should emit onBlur event', async () => {
    const input = wrapper.find('input');

    await input.trigger('blur');

    expect(wrapper.emitted().onBlur).toBeTruthy();
  });

  it('should emit onKeyUp event', async () => {
    const input = wrapper.find('input');

    await input.trigger('keydown.up');

    expect(wrapper.emitted().onKeyUp).toBeTruthy();
  });

  it('should emit onKeyDown event', async () => {
    const input = wrapper.find('input');

    await input.trigger('keydown.down');

    expect(wrapper.emitted().onKeyDown).toBeTruthy();
  });

  it('should emit onKeyEnter event', async () => {
    const input = wrapper.find('input');

    await input.trigger('keyup.enter');

    expect(wrapper.emitted().onKeyEnter).toBeTruthy();
  });

  it('should contain icon-left slot', async () => {
    expect(wrapper.find('.icon-left').exists()).toBe(true);
  });

  it('should contain icon-right slot', async () => {
    expect(wrapper.find('.icon-right').exists()).toBe(true);
  });
});
