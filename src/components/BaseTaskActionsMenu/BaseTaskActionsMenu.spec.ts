import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { BadgeCheck, Copy, Undo, Trash2 } from 'lucide-vue-next';
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
        BadgeCheck,
        Copy,
        Undo,
        Trash2,
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
  const { currentEditingTask, isTaskActionMenuOpen } = storeToRefs(commonStore);
  const { tasks } = storeToRefs(tasksStore);

  tasks.value = {
    '0909999': {
      items: [
        {
          dayId: '0909999',
          id: '1',
          description: 'test',
          isDone: false,
          labels: [],
        },
      ],
    },
    backlog: {
      items: [
        {
          dayId: 'backlog',
          id: '102023',
          description: 'Test description',
          isDone: true,
          labels: [],
        },
      ],
    },
  };

  isTaskActionMenuOpen.value = true;

  it('should contain BasePopup component', () => {
    expect(wrapper.findComponent(BasePopup).exists()).toBe(true);
  });

  it('should contain BaseButton component', () => {
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('should have icons component', () => {
    expect(wrapper.findComponent(BadgeCheck).exists()).toBe(true);
    expect(wrapper.findComponent(Copy).exists()).toBe(true);
    expect(wrapper.findComponent(Undo).exists()).toBe(true);
    expect(wrapper.findComponent(Trash2).exists()).toBe(true);
  });

  it('should update copies counter', async () => {
    currentEditingTask.value = {
      id: '1',
      description: 'test',
      isDone: false,
      dayId: 'backlog',
      labels: [],
    };
    const duplicateTaskButton = wrapper.find('[data-testid="duplicate-task-button"]');

    await duplicateTaskButton.trigger('click');
    await duplicateTaskButton.trigger('click');
    await duplicateTaskButton.trigger('click');

    expect(duplicateTaskButton.html()).toContain('(3)');

    currentEditingTask.value = null;
  });

  it('should change text on done/undone button', async () => {
    currentEditingTask.value = {
      dayId: 'backlog',
      id: '102023',
      description: 'Test description',
      isDone: true,
      labels: [],
    };

    const doneButton = wrapper.find('[data-testid="mark-as-done-button"]');

    expect(doneButton.html()).toContain('Mark as done');
    expect(doneButton.classes()).toContain('!text-teal-500');

    await doneButton.trigger('click');

    expect(doneButton.html()).toContain('Mark as undone');
    expect(doneButton.classes()).not.toContain('!text-teal-500');

    currentEditingTask.value = null;
  });

  it('should show move to backlog button if dayId not "backlog"', async () => {
    currentEditingTask.value = {
      dayId: '0909999',
      id: '1',
      description: 'test',
      isDone: false,
      labels: [],
    };

    const moveTaskToBacklogButton = wrapper.find('[data-testid="move-to-backlog-button"]');

    expect(moveTaskToBacklogButton.exists()).toBe(true);
  });

  it('should show delete confirmation', async () => {
    const deleteTaskButton = wrapper.find('[data-testid="delete-task-button"]');

    await deleteTaskButton.trigger('click');

    expect(wrapper.html()).toContain('Confirm deletion');
  });

  it('should call function when click on copy task button', async () => {
    const copyCurrentTask = vi.spyOn(wrapper.vm, 'copyCurrentTask');
    const duplicateTaskButton = wrapper.find('[data-testid="duplicate-task-button"]');

    await duplicateTaskButton.trigger('click');

    expect(copyCurrentTask).toHaveBeenCalled();
  });

  it('should call function when click on move to backlog button', async () => {
    const moveTaskToBacklog = vi.spyOn(wrapper.vm, 'moveTaskToBacklog');
    const moveTaskToBacklogButton = wrapper.find('[data-testid="move-to-backlog-button"]');

    await moveTaskToBacklogButton.trigger('click');

    expect(moveTaskToBacklog).toHaveBeenCalled();
  });

  it('should call function when click on delete task button', async () => {
    const removeTask = vi.spyOn(wrapper.vm, 'removeTask');
    const confirmDeleteButton = wrapper.find('[data-testid="confirm-delete-task-button"]');

    await confirmDeleteButton.trigger('click');

    expect(removeTask).toHaveBeenCalled();
  });
});
