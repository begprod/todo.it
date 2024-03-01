import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { PlusIcon, QueueListIcon } from '@heroicons/vue/24/outline';
import { useCommonStore, useTasksStore, useCalendarStore } from '@/stores';
import draggableComponent from 'vuedraggable';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskList from '@/components/BaseTaskList/BaseTaskList.vue';
import BaseAccordion from '@/components/ui/BaseAccordion/BaseAccordion.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

describe('BaseTaskList', () => {
  const wrapper = mount(BaseTaskList, {
    global: {
      components: {
        BaseAccordion,
        BaseTask,
        BaseEmptyListMessage,
        PlusIcon,
        QueueListIcon,
        draggableComponent,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const commonStore = useCommonStore();
  const calendarStore = useCalendarStore();
  const tasksStore = useTasksStore();
  const { toggleSidebar } = commonStore;
  const { isSidebarOpen } = storeToRefs(commonStore);
  const { months, days } = storeToRefs(calendarStore);
  const { tasks } = storeToRefs(tasksStore);

  months.value = [
    {
      id: '102023',
      isCurrent: true,
      monthString: new Date(),
      name: 'October',
    },
  ];

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
          description: 'Test description',
          isDone: false,
        },
      ],
    },
  };

  it('should render open accordion with task list', async () => {
    expect(wrapper.html()).toContain('October');
    expect(wrapper.html()).toContain('October 23');
    expect(wrapper.html()).toContain('Test description');
    expect(wrapper.html()).toContain('current-day');

    expect(wrapper.findComponent(BaseAccordion).exists()).toBe(true);
    expect(wrapper.findComponent(BaseTask).exists()).toBe(true);
    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(false);
    expect(wrapper.findComponent(draggableComponent).exists()).toBe(true);
  });

  it('should contain expand sidebar button', async () => {
    isSidebarOpen.value = false;

    months.value = [
      {
        id: '102023',
        isCurrent: true,
        monthString: new Date(),
        name: 'October',
      },
    ];

    await nextTick();

    const button = wrapper.findAllComponents(BaseButton)[0].html();

    expect(button.includes('Expand backlog sidebar')).toBe(true);
    expect(wrapper.findComponent(QueueListIcon).exists()).toBe(true);
  });

  it('should call toggleSidebar when toggle button is clicked', async () => {
    await wrapper.findAllComponents(BaseButton)[0].trigger('click');

    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('should contain add task button', () => {
    const button = wrapper.findAllComponents(BaseButton)[1].html();

    expect(button.includes('Add task')).toBe(true);
    expect(wrapper.findComponent(PlusIcon).exists()).toBe(true);
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
    expect(wrapper.html()).toContain('October 23');
    expect(wrapper.html()).toContain('No tasks for this day');

    expect(wrapper.findComponent(BaseEmptyListMessage).exists()).toBe(true);
  });

  it('should contain pin when passed isActive prop', async () => {
    expect(wrapper.html()).toContain(
      'shrink-0 w-3 h-3 mr-2 rounded-[4px] bg-emerald-400 shadow-sm animate-pulse select-none',
    );
  });
});
