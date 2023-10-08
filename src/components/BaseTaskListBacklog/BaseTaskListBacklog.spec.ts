import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { HiDotsVertical, HiPlus, MdCancelOutlined, OiGrabber } from 'oh-vue-icons/icons';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useTasksStore } from '@/stores';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';

addIcons(HiDotsVertical, HiPlus, MdCancelOutlined, OiGrabber);

describe('BaseTaskListBacklog', () => {
  const wrapper = mount(BaseTaskListBacklog, {
    global: {
      components: {
        BaseEmptyListMessage,
        BaseTask,
        'v-icon': OhVueIcon,
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

  it('correctly render backlog with tasks', async () => {
    tasks.value = {
      backlog: {
        items: [
          {
            dayId: '102023',
            id: '102023',
            title: 'Backlog test title',
            description: 'Backlog test description',
            isDone: false,
          },
        ],
      },
    };

    await nextTick();

    expect(wrapper.html()).toContain('Backlog test title');
    expect(wrapper.html()).toContain('Backlog test description');
  });

  it('correctly render empty backlog', async () => {
    tasks.value = {
      backlog: {
        items: [],
      },
    };

    await nextTick();

    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(true);
    expect(wrapper.html()).toContain('No tasks in backlog');
  });
});
