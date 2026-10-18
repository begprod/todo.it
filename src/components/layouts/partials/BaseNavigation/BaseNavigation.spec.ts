import type { ComponentWrapperType, IMenuItem } from '@/types';
import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { LayoutDashboard, ListChecks, Settings } from 'lucide-vue-next';
import { routes } from '@/router';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';

describe('BaseNavigation', () => {
  let wrapper: ComponentWrapperType<typeof BaseNavigation>;

  const items: IMenuItem[] = [
    { name: 'home', title: '_board', to: '/', icon: LayoutDashboard },
    { name: 'backlog', title: '_backlog', to: '/backlog', icon: ListChecks },
    { name: 'settings', title: '_settings', icon: Settings },
  ];

  const createComponent = async (props: { items: IMenuItem[]; activeName?: string }) => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/');
    await router.isReady();

    wrapper = mount(BaseNavigation, {
      props,
      global: {
        plugins: [router],
      },
    });
  };

  afterEach(() => wrapper.unmount());

  it('should render one entry per item', async () => {
    await createComponent({ items });

    expect(wrapper.findAll('[data-test-id^="nav-link-"]')).toHaveLength(3);
    expect(wrapper.find('[data-test-id="nav-link-home"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="nav-link-backlog"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="nav-link-settings"]').exists()).toBe(true);
  });

  it('should render the item icon and title', async () => {
    await createComponent({ items });

    const homeLink = wrapper.find('[data-test-id="nav-link-home"]');

    expect(homeLink.findComponent(LayoutDashboard).exists()).toBe(true);
    expect(homeLink.text()).toBe('_board');
  });

  it('should render items with "to" as anchors and items without it as buttons', async () => {
    await createComponent({ items });

    expect(wrapper.find('[data-test-id="nav-link-home"]').element.tagName).toBe('A');
    expect(wrapper.find('[data-test-id="nav-link-settings"]').element.tagName).toBe('BUTTON');
  });

  it('should mark only the active item with the active class and aria-current', async () => {
    await createComponent({ items, activeName: 'backlog' });

    const backlogLink = wrapper.find('[data-test-id="nav-link-backlog"]');
    const homeLink = wrapper.find('[data-test-id="nav-link-home"]');

    expect(backlogLink.classes()).toContain('navigation__link_active');
    expect(backlogLink.attributes('aria-current')).toBe('page');
    expect(homeLink.classes()).not.toContain('navigation__link_active');
    expect(homeLink.attributes('aria-current')).toBeUndefined();
  });

  it('should emit select with the item when a button item is clicked', async () => {
    await createComponent({ items });

    await wrapper.find('[data-test-id="nav-link-settings"]').trigger('click');

    expect(wrapper.emitted('select')).toEqual([[items[2]]]);
  });

  it('should not emit select when a link item is clicked', async () => {
    await createComponent({ items });

    await wrapper.find('[data-test-id="nav-link-home"]').trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
  });
});
