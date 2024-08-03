import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLabel from '@/components/ui/BaseLabel/BaseLabel.vue';

describe('BaseLabel', () => {
  let wrapper: ComponentWrapperType<typeof BaseLabel>;

  const createComponent = () => {
    wrapper = mount(BaseLabel, {
      props: {
        title: 'test',
        color: '#ffeeff',
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
    expect(wrapper.props().title).toBe('test');
    expect(wrapper.props().color).toBe('#ffeeff');
  });
});
