import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';

describe('BaseFooter', () => {
  const wrapper = mount(BaseFooter);

  it('should contain links', () => {
    const links = wrapper.findAll('a');

    expect(links[0].attributes().href).toBe('https://github.com/begprod');
    expect(links[0].text()).toBe('Andrej Aratov');
    expect(links[1].attributes().href).toBe(
      'https://github.com/begprod/todo.it#install-application-on-your-device',
    );
    expect(links[1].text()).toBe('Install app on device instruction');
  });
});
