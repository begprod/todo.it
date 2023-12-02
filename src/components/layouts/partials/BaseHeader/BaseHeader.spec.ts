import { version } from '../../../../../package.json';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';

describe('BaseHeader', () => {
  const wrapper = mount(BaseHeader);

  it('should contain css classes', () => {
    expect(wrapper.html()).toContain('sticky top-0 w-full bg-white z-[100]');
    expect(wrapper.html()).toContain('container mx-auto p-5 flex items-center justify-between');
    expect(wrapper.html()).toContain('logo-gradient gradient-animation text-2xl lg:text-4xl');
    expect(wrapper.html()).toContain('logo-sub-gradient gradient-animation text-sm ml-2 bottom-0');
    expect(wrapper.html()).toContain(
      'w-7 lg:w-10 opacity-80 hover:opacity-100 transition-all duration-300',
    );
  });

  it('should contain github image', () => {
    expect(wrapper.html()).toContain('/todo.it/src/assets/images/github-mark.svg');
  });

  it('should contain app version', () => {
    expect(wrapper.html()).toContain(`v${version}`);
  });
});
