import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

describe('BaseLayout', () => {
  const wrapper = shallowMount(BaseLayout, {
    slots: {
      default: '<div data-test-id="slot-content">Slot content</div>',
    },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  it('should have components', () => {
    expect(wrapper.findComponent(BaseSidebar).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseLabelActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskLabelMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseToast).exists()).toBe(true);
  });

  it('should render slot content inside layout inner', () => {
    expect(wrapper.find('.layout__inner [data-test-id="slot-content"]').exists()).toBe(true);
  });
});
