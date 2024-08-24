import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';
import BaseToast from '@/components/ui/BaseToast/BaseToast.vue';

describe('BaseLayout', () => {
  const wrapper = shallowMount(BaseLayout, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  it('should have components', () => {
    expect(wrapper.findComponent(BaseBacklog).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskList).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseLabelActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseToast).exists()).toBe(true);
  });
});
