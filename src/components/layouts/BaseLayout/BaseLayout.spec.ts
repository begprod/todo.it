import { defineComponent, h } from 'vue';
import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

describe('BaseLayout', () => {
  // Stub that renders the sidebar slots, so BaseNavigation inside the nav slot is reachable.
  const SidebarStub = defineComponent({
    setup(_, { slots }) {
      return () => h('div', [slots.logo?.(), slots.nav?.(), slots.footer?.()]);
    },
  });

  const createWrapper = async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/backlog');
    await router.isReady();

    return shallowMount(BaseLayout, {
      slots: {
        default: '<div data-test-id="slot-content">Slot content</div>',
      },
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          BaseSidebar: SidebarStub,
        },
      },
    });
  };

  it('should have components', async () => {
    const wrapper = await createWrapper();

    expect(wrapper.findComponent(BaseSidebar).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseLabelActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskLabelMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseToast).exists()).toBe(true);
  });

  it('should render slot content inside layout inner', async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find('.layout__inner [data-test-id="slot-content"]').exists()).toBe(true);
  });

  it('should pass top-level navigation items and active route name to navigation', async () => {
    const wrapper = await createWrapper();
    const navigation = wrapper.findComponent(BaseNavigation);

    expect(navigation.props('items').map((item: { name: string }) => item.name)).toEqual([
      'home',
      'backlog',
      'settings',
    ]);
    expect(navigation.props('activeName')).toBe('backlog');
  });
});
