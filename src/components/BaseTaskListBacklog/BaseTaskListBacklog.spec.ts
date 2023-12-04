import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useTasksStore } from '@/stores';
import draggableComponent from 'vuedraggable';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

describe('BaseTaskListBacklog', () => {
  const wrapper = mount(BaseTaskListBacklog, {
    global: {
      components: {
        draggableComponent,
        BaseTask,
        BaseEmptyListMessage,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const tasksStore = useTasksStore();
  const { tasks } = storeToRefs(tasksStore);

  it('should render backlog with tasks', async () => {
    tasks.value = {
      backlog: {
        items: [
          {
            dayId: '102023',
            id: '102023',
            description: 'Backlog test description',
            isDone: false,
          },
        ],
      },
    };

    await nextTick();

    expect(wrapper.html()).toContain('Backlog test description');

    expect(wrapper.findComponent(draggableComponent).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTask).exists()).toBe(true);
    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(false);
  });

  it('should render empty backlog', async () => {
    tasks.value = {
      backlog: {
        items: [],
      },
    };

    await nextTick();

    expect(wrapper.html()).toContain('No tasks in backlog');

    expect(wrapper.findComponent(draggableComponent).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTask).exists()).toBe(false);
    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(true);
  });
});
