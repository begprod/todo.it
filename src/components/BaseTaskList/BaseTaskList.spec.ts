import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useTasksStore, useCalendarStore } from '@/stores';
import draggableComponent from 'vuedraggable';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

describe('BaseTaskList', () => {
  const wrapper = mount(BaseTaskList, {
    global: {
      components: {
        BaseButton,
        BaseAccordion,
        BaseTask,
        BaseEmptyListMessage,
        PlusIcon,
        draggableComponent,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const calendarStore = useCalendarStore();
  const tasksStore = useTasksStore();
  const { months, days } = storeToRefs(calendarStore);
  const { tasks } = storeToRefs(tasksStore);

  days.value = [
    {
      id: '102023',
      isCurrent: true,
      isPast: false,
      monthId: '102023',
      name: 'October',
      number: '23',
    },
  ];

  tasks.value = {
    '102023': {
      items: [
        {
          dayId: '102023',
          id: '102023',
          title: 'Test title',
          description: 'Test description',
          isDone: false,
        },
      ],
    },
  };

  it('should render open accordion with task list', async () => {
    months.value = [
      {
        id: '102023',
        isCurrent: true,
        monthString: new Date(),
        name: 'October',
      },
    ];

    await nextTick();

    expect(wrapper.html()).toContain('October');
    expect(wrapper.html()).toContain('23 October');
    expect(wrapper.html()).toContain('Test title');
    expect(wrapper.html()).toContain('Test description');
    expect(wrapper.html()).toContain('current-day');

    expect(wrapper.findComponent(BaseAccordion).exists()).toBe(true);
    expect(wrapper.findComponent(draggableComponent).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTask).exists()).toBe(true);
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(false);
  });

  it('should render closed accordion with task list', async () => {
    months.value = [
      {
        id: '112023',
        isCurrent: false,
        monthString: new Date(),
        name: 'October',
      },
    ];

    await nextTick();

    expect(wrapper.html()).toContain('October');
    expect(wrapper.html()).not.toContain('23 October');
    expect(wrapper.html()).not.toContain('Test title');
    expect(wrapper.html()).not.toContain('Test description');

    expect(wrapper.findComponent(BaseAccordion).exists()).toBe(true);
    expect(wrapper.findComponent(draggableComponent).exists()).toBe(false);
    expect(wrapper.findComponent(BaseTask).exists()).toBe(false);
    expect(wrapper.findComponent(BaseButton).exists()).toBe(false);
    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(false);
  });

  it('should render empty task list', async () => {
    months.value = [
      {
        id: '102023',
        isCurrent: true,
        monthString: new Date(),
        name: 'October',
      },
    ];

    tasks.value = {
      '102023': {
        items: [],
      },
    };

    await nextTick();

    expect(wrapper.html()).toContain('October');
    expect(wrapper.html()).toContain('23 October');
    expect(wrapper.html()).toContain('No tasks for this day');

    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(true);
  });

  it('should have icon component', () => {
    expect(wrapper.findComponent(PlusIcon).exists()).toBe(true);
  });
});
