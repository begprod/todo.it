import { version } from '../../../../../package.json';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';

describe('BaseLogo', () => {
  const wrapper = mount(BaseLogo);

  it('should contain css classes', () => {
    expect(wrapper.html()).toContain('logo-gradient gradient-animation logo__text');
    expect(wrapper.html()).toContain('logo-sub-gradient gradient-animation logo__version');
  });

  it('should contain app version', () => {
    expect(wrapper.html()).toContain(`v${version}`);
  });
});
