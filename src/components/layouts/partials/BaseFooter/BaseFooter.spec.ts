import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';

describe('BaseFooter', () => {
  const wrapper = mount(BaseFooter);

  it('correctly render component', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
