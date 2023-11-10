import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';

describe('BaseHeader', () => {
  const wrapper = mount(BaseHeader);

  it('should match snapshot BaseHeader', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
