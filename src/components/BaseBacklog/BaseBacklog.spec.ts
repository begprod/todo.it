import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { PlusIcon, ChevronLeftIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

describe('BaseBacklog', () => {
  const wrapper = mount(BaseBacklog, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
    components: {
      BaseSidebar,
      BaseLogo,
      BaseButton,
      BaseTaskListBacklog,
      Cog6ToothIcon,
      PlusIcon,
    },
  });

  const commonStore = useCommonStore();
  const tasksStore = useTasksStore();
  const { toggleSidebar } = commonStore;
  const { createTask } = tasksStore;

  it('should contain sidebar', () => {
    expect(wrapper.findComponent(BaseSidebar).exists()).toBe(true);
  });

  it('should contain logo', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
  });

  it('should contain github image', () => {
    expect(wrapper.html()).toContain(
      'w-6 opacity-80 hover:opacity-100 transition-all duration-300',
    );
    expect(wrapper.html()).toContain('/todo.it/src/assets/images/github-mark.svg');
  });

  it('should contain collapse/expand settings button', () => {
    const button = wrapper.findAllComponents(BaseButton)[0].html();

    expect(button.includes('Collapse/Expand settings sidebar')).toBe(true);
    expect(wrapper.findComponent(Cog6ToothIcon).exists()).toBe(true);
  });

  it('should contain add to backlog button', async () => {
    const button = wrapper.findAllComponents(BaseButton)[1].html();

    expect(button.includes('Add to backlog')).toBe(true);
    expect(wrapper.findComponent(PlusIcon).exists()).toBe(true);
  });

  it('should contain collapse sidebar button', () => {
    const button = wrapper.findAllComponents(BaseButton)[2].html();

    expect(button.includes('Collapse backlog sidebar')).toBe(true);
    expect(wrapper.findComponent(ChevronLeftIcon).exists()).toBe(true);
  });

  it('should contain task list', () => {
    expect(wrapper.findComponent(BaseTaskListBacklog).exists()).toBe(true);
  });

  it('should call createTask with backlog id when button is clicked', async () => {
    await wrapper.findAllComponents(BaseButton)[1].trigger('click');

    expect(createTask).toHaveBeenCalled();
  });

  it('should call toggleSidebar when toggle button is clicked', async () => {
    await wrapper.findAllComponents(BaseButton)[2].trigger('click');

    expect(toggleSidebar).toHaveBeenCalled();
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});
