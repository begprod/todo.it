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
        autocomplete: 'true',
        isError: false,
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
    expect(wrapper.props().autocomplete).toBe('true');
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
});
