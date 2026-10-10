import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';

describe('BaseNavigation', () => {
  let wrapper: ComponentWrapperType<typeof BaseNavigation>;
  let router: ReturnType<typeof createRouter>;

  const createComponent = async () => {
    router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/');
    await router.isReady();

    // Use the real RouterLink so this test can verify route-dependent active classes.
    wrapper = mount(BaseNavigation, {
      global: {
        plugins: [router],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render visible routes as navigation links', () => {
    const links = wrapper.findAll('a');

    expect(links).toHaveLength(3);
    expect(links.map((link) => link.text())).toEqual(['_board', '_backlog', '_settings']);
    expect(wrapper.find('[data-test-id="nav-link-home"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="nav-link-backlog"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="nav-link-settings"]').exists()).toBe(true);
  });

  it('should mark the current route as active', async () => {
    await router.push('/backlog');
    await flushPromises();

    expect(wrapper.find('[data-test-id="nav-link-backlog"]').classes()).toContain(
      'router-link-active',
    );
  });

  it('should have an accessible navigation label', () => {
    expect(wrapper.find('nav[aria-label="Main"]').exists()).toBe(true);
  });
});
