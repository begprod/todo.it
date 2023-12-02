import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';

describe('BaseFooter', () => {
  const wrapper = mount(BaseFooter);

  it('should contain css classes', () => {
    expect(wrapper.html()).toContain(
      'container flex flex-col items-center justify-center mx-auto p-5 pb-10 text-sm text-center text-gray-700',
    );
    expect(wrapper.html()).toContain('text-red-600 text-md');
    expect(wrapper.html()).toContain('underline');
    expect(wrapper.html()).toContain('inline-block ml-2 -rotate-12 origin-center');
  });

  it('should contain installation link', () => {
    expect(wrapper.html()).toContain(
      'https://github.com/begprod/todo.it#install-application-on-your-device',
    );
  });
});
