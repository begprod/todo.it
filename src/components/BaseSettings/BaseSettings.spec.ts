import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';

describe('BaseSettings', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettings>;

  const createComponent = async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/settings/scopes');
    await router.isReady();

    wrapper = mount(BaseSettings, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: vi.fn })],
        // Panels are rendered by nested routes; stub RouterView to avoid rendering SettingsView recursively.
        stubs: { RouterView: true },
      },
    });
    await flushPromises();
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render four settings navigation items', () => {
    const navigation = wrapper.findComponent(BaseNavigation);

    expect(navigation.props('items')).toHaveLength(4);
    expect(navigation.props('items').map((item: { to?: string }) => item.to)).toEqual([
      '/settings/scopes',
      '/settings/labels',
      '/settings/view-type',
      '/settings/backup',
    ]);
  });

  it('should mark the current settings section as active', () => {
    expect(wrapper.find('[data-test-id="nav-link-settings-scopes"]').classes()).toContain(
      'navigation__link_active',
    );
    expect(wrapper.find('[data-test-id="nav-link-settings-labels"]').classes()).not.toContain(
      'navigation__link_active',
    );
  });

  it('should render the router view for the panels', () => {
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
  });

  it('should render the page title of the current settings section', () => {
    expect(wrapper.find('h1.setting__title').text()).toBe('Scopes');
  });

  it('should update the page title when the settings section changes', async () => {
    await wrapper.vm.$router.push('/settings/labels');
    await flushPromises();

    expect(wrapper.find('h1.setting__title').text()).toBe('Labels');
  });
});
