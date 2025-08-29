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
    const duplicateTaskButton = wrapper.find('[title="Duplicate"]');

    await duplicateTaskButton.trigger('click');
    await duplicateTaskButton.trigger('click');
    await duplicateTaskButton.trigger('click');

    expect(duplicateTaskButton.text()).toContain('(3)');

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

    const doneButton = wrapper.find('[title="Mark as done"]');

    expect(doneButton.text()).toContain('Mark as done');
    expect(doneButton.classes()).toContain('button_color_success');

    await doneButton.trigger('click');

    expect(doneButton.text()).toContain('Mark as undone');
    expect(doneButton.classes()).not.toContain('button_color_success');

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

    const moveTaskToBacklogButton = wrapper.find('[title="Move to backlog"]');

    expect(moveTaskToBacklogButton.exists()).toBe(true);
  });

  it('should show delete confirmation', async () => {
    const deleteTaskButton = wrapper.find('[title="Delete"]');

    await deleteTaskButton.trigger('click');

    const confirmDeletionButton = wrapper.find('[title="Confirm deletion"]');

    expect(confirmDeletionButton.exists()).toBe(true);
  });

  it('should call function when click on copy task button', async () => {
    const copyCurrentTask = vi.spyOn(wrapper.vm, 'copyCurrentTask');
    const duplicateTaskButton = wrapper.find('[title="Duplicate"]');

    await duplicateTaskButton.trigger('click');

    expect(copyCurrentTask).toHaveBeenCalled();
  });

  it('should call function when click on move to backlog button', async () => {
    const moveTaskToBacklog = vi.spyOn(wrapper.vm, 'moveTaskToBacklog');
    const moveTaskToBacklogButton = wrapper.find('[title="Move to backlog"]');

    await moveTaskToBacklogButton.trigger('click');

    expect(moveTaskToBacklog).toHaveBeenCalled();
  });

  it('should call function when click on delete task button', async () => {
    const removeTask = vi.spyOn(wrapper.vm, 'removeTask');
    const confirmDeletionButton = wrapper.find('[title="Confirm deletion"]');

    await confirmDeletionButton.trigger('click');

    expect(removeTask).toHaveBeenCalled();
  });
});
