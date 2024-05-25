import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';

describe('BaseFooter', () => {
  const wrapper = mount(BaseFooter);

  it('should contain elements', () => {
    const footer = wrapper.find('[data-testid="footer"]');
    const authorLink = wrapper.find('[data-testid="author-link"]');
    const installationLink = wrapper.find('[data-testid="installation-link"]');

    expect(footer.exists()).toBe(true);
    expect(authorLink.exists()).toBe(true);
    expect(installationLink.exists()).toBe(true);
  });

  it('should contain links', () => {
    const authorLink = wrapper.find('[data-testid="author-link"]');
    const installationLink = wrapper.find('[data-testid="installation-link"]');

    expect(authorLink.html()).toContain('https://github.com/begprod');
    expect(installationLink.html()).toContain(
      'https://github.com/begprod/todo.it#install-application-on-your-device',
    );
  });
});
