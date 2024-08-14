import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSelect from '@/components/ui/BaseSelect/BaseSelect.vue';

describe('BaseSelect', () => {
  let wrapper: ComponentWrapperType<typeof BaseSelect>;

  const createComponent = () => {
    wrapper = mount(BaseSelect, {
      props: {
        id: 'test id',
        options: ['test1', 'test2'],
        placeholder: 'test placeholder',
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
    expect(wrapper.props().id).toBe('test id');
    expect(wrapper.props().options).toEqual(['test1', 'test2']);
    expect(wrapper.props().placeholder).toBe('test placeholder');
  });

  it('should render options', async () => {
    const placeholder = wrapper.find('[data-test-id="select-placeholder"]');
    const options = wrapper.findAll('[data-test-id="select-option"]');

    expect(placeholder.exists()).toBe(true);
    expect(placeholder.text()).toBe('test placeholder');
    expect(options).toHaveLength(2);
    expect(options[0].text()).toBe('test1');
    expect(options[1].text()).toBe('test2');
  });

  it('should emit change/update:modelValue event', async () => {
    const options = wrapper.findAll('[data-test-id="select-option"]');

    await options[0].trigger('change');

    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['test1']);
  });
});
