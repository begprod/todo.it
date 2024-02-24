import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { QueueListIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useTasksStore } from '@/stores';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  const wrapper = mount(BaseSidebar, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
    components: {
      BaseButton,
      BaseTaskListBacklog,
      QueueListIcon,
      PlusIcon,
    },
  });

  const tasksStore = useTasksStore();
  const { createTask } = tasksStore;

  it('should contain logo', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
  });

  it('should contain github image', () => {
    expect(wrapper.html()).toContain(
      'w-6 opacity-80 hover:opacity-100 transition-all duration-300',
    );
    expect(wrapper.html()).toContain('/todo.it/src/assets/images/github-mark.svg');
  });

  it('should render button and backlog', async () => {
    expect(wrapper.findAllComponents(BaseButton).length).toBe(1);
    expect(wrapper.findComponent(BaseTaskListBacklog).exists()).toBe(true);
    expect(wrapper.findComponent(PlusIcon).exists()).toBe(true);
  });

  it('should call createTask with backlog id when button is clicked', async () => {
    await wrapper.findAllComponents(BaseButton)[0].trigger('click');

    expect(createTask).toHaveBeenCalled();
  });
});
