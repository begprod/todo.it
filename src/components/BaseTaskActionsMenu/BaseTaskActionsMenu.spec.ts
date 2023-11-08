import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import {
  DocumentDuplicateIcon,
  DocumentCheckIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/vue/24/outline';
import { useCommonStore, useTasksStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';

describe('BaseTaskActionsMenu', () => {
  const wrapper = mount(BaseTaskActionsMenu, {
    global: {
      components: {
        BasePopup,
        BaseButton,
        DocumentDuplicateIcon,
        DocumentCheckIcon,
        TrashIcon,
        ArrowUturnLeftIcon,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const tasksStore = useTasksStore();
  const commonStore = useCommonStore();
  const { currentEditingTask, isActionMenuOpen } = storeToRefs(commonStore);
  const { tasks } = storeToRefs(tasksStore);

  tasks.value = {
    '0909999': {
      items: [
        {
          dayId: '0909999',
          id: '1',
          title: 'test',
          description: 'test',
          isDone: false,
        },
      ],
    },
    backlog: {
      items: [
        {
          dayId: 'backlog',
          id: '102023',
          title: 'Test title',
          description: 'Test description',
          isDone: true,
        },
      ],
    },
  };

  isActionMenuOpen.value = true;

  it('should update copies counter', async () => {
    currentEditingTask.value = {
      id: '1',
      title: 'test',
      description: 'test',
      isDone: false,
      dayId: 'backlog',
    };

    await wrapper.findAll('button')[0].trigger('click');
    await wrapper.findAll('button')[0].trigger('click');
    await wrapper.findAll('button')[0].trigger('click');

    expect(wrapper.html()).toContain('(3)');

    currentEditingTask.value = null;
  });

  it('should change text on done/undone button', async () => {
    currentEditingTask.value = {
      dayId: 'backlog',
      id: '102023',
      title: 'Test title',
      description: 'Test description',
      isDone: true,
    };

    expect(wrapper.findAll('button')[1].html()).toContain('Mark as done');
    expect(wrapper.findAll('button')[1].classes()).toContain('!text-teal-500');

    await wrapper.findAll('button')[1].trigger('click');

    expect(wrapper.findAll('button')[1].html()).toContain('Mark as undone');
    expect(wrapper.findAll('button')[1].classes()).not.toContain('!text-teal-500');

    currentEditingTask.value = null;
  });

  it('should show move to backlog button if dayId not "backlog"', async () => {
    currentEditingTask.value = {
      dayId: '0909999',
      id: '1',
      title: 'test',
      description: 'test',
      isDone: false,
    };

    expect(wrapper.html()).toContain('Move to backlog');
  });

  it('should show delete confirmation', async () => {
    await wrapper.findAll('button')[3].trigger('click');

    expect(wrapper.html()).toContain('Confirm deletion');
  });

  it('should contain BasePopup component', () => {
    expect(wrapper.findComponent(BasePopup).exists()).toBe(true);
  });

  it('should contain BaseButton component', () => {
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('should have icons component', () => {
    expect(wrapper.findComponent(DocumentDuplicateIcon).exists()).toBe(true);
    expect(wrapper.findComponent(DocumentCheckIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ArrowUturnLeftIcon).exists()).toBe(true);
    expect(wrapper.findComponent(TrashIcon).exists()).toBe(true);
  });

  it('should call function when click on copy task button', async () => {
    const copyCurrentTask = vi.spyOn(wrapper.vm, 'copyCurrentTask');

    await wrapper.findAll('button')[0].trigger('click');

    expect(copyCurrentTask).toHaveBeenCalled();
  });

  it('should call function when click on move to backlog button', async () => {
    const moveTaskToBacklog = vi.spyOn(wrapper.vm, 'moveTaskToBacklog');

    await wrapper.findAll('button')[2].trigger('click');

    expect(moveTaskToBacklog).toHaveBeenCalled();
  });

  it('should call function when click on delete task button', async () => {
    const removeTask = vi.spyOn(wrapper.vm, 'removeTask');

    await wrapper.findAll('button')[3].trigger('click');

    expect(removeTask).toHaveBeenCalled();
  });
});
