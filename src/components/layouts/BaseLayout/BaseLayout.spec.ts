import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';

describe('BaseLayout', () => {
  const wrapper = shallowMount(BaseLayout);

  it('correctly render components', () => {
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
    expect(wrapper.findComponent(BaseFooter).exists()).toBe(true);
    expect(wrapper.findComponent(BaseSidebar).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskList).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskActionsMenu).exists()).toBe(true);
  });
});
