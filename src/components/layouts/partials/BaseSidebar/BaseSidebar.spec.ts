import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { BiLayoutSidebarInset, HiPlus } from 'oh-vue-icons/icons';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';

addIcons(BiLayoutSidebarInset, HiPlus);

describe('BaseSidebar.vue', () => {
  const wrapper = shallowMount(BaseSidebar, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
    components: {
      'v-icon': OhVueIcon,
    },
  });

  const commonStore = useCommonStore();
  const tasksStore = useTasksStore();
  const { isSidebarOpen } = storeToRefs(commonStore);
  const { toggleSidebar } = commonStore;
  const { createTask } = tasksStore;

  it('should render only button when sidebar is closed', async () => {
    isSidebarOpen.value = false;

    await nextTick(() => {
      expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
      expect(wrapper.findAllComponents(BaseButton).length).toBe(1);
      expect(wrapper.findComponent(BaseTaskListBacklog).exists()).toBe(false);
    });
  });

  it('should render two buttons and backlog when sidebar is open', async () => {
    isSidebarOpen.value = true;

    await nextTick(() => {
      expect(wrapper.findAllComponents(BaseButton).length).toBe(2);
      expect(wrapper.findComponent(BaseTaskListBacklog).exists()).toBe(true);
    });
  });

  it('should call toggleSidebar when button is clicked', async () => {
    isSidebarOpen.value = true;

    await nextTick(async () => {
      await wrapper.findComponent(BaseButton).trigger('click');

      expect(toggleSidebar).toHaveBeenCalled();
    });

    isSidebarOpen.value = false;

    await nextTick(async () => {
      await wrapper.findComponent(BaseButton).trigger('click');

      expect(toggleSidebar).toHaveBeenCalled();
    });
  });

  it('should call createTask with backlog id when button is clicked', async () => {
    isSidebarOpen.value = true;

    await nextTick(async () => {
      await wrapper.findAllComponents(BaseButton)[1].trigger('click');

      expect(createTask).toHaveBeenCalled();
    });
  });
});
