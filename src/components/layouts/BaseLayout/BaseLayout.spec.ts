import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BaseLayout from '@/components/layouts/BaseLayout/BaseLayout.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';

describe('BaseLayout', () => {
  const wrapper = shallowMount(BaseLayout);

  it('should have components', () => {
    expect(wrapper.findComponent(BaseBacklog).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskList).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTaskActionsMenu).exists()).toBe(true);
    expect(wrapper.findComponent(BaseFooter).exists()).toBe(true);
  });
});
