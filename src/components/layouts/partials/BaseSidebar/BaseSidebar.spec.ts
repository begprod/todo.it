import type { ComponentWrapperType } from '@/types';
import { h } from 'vue';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  let wrapper: ComponentWrapperType<typeof BaseSidebar>;

  const createComponent = () => {
    wrapper = mount(BaseSidebar, {
      slots: {
        logo: '<div data-test-id="sidebar-logo" />',
        nav: '<div data-test-id="sidebar-nav" />',
        footer: '<div data-test-id="sidebar-footer" />',
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render its logo, navigation, and footer slots', () => {
    expect(wrapper.find('[data-test-id="sidebar-logo"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="sidebar-nav"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="sidebar-footer"]').exists()).toBe(true);
  });

  it('should render navigation passed into the nav slot', () => {
    const sidebar = mount(BaseSidebar, {
      slots: {
        nav: () => h(BaseNavigation, { items: [] }),
      },
    });

    expect(sidebar.findComponent(BaseNavigation).exists()).toBe(true);

    sidebar.unmount();
  });

  it('should render its inner and footer sections', () => {
    expect(wrapper.find('.sidebar__inner').exists()).toBe(true);
    expect(wrapper.find('.sidebar__footer').exists()).toBe(true);
  });
});
