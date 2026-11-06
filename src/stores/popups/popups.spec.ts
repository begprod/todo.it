import type { ITask, ILabel } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { usePopupsStore } from '@/stores';

describe('popups store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const popupsStore = usePopupsStore();
  const {
    currentEditingTask,
    currentEditingLabel,
    isTaskActionMenuOpen,
    isTaskLabelMenuOpen,
    isLabelActionMenuOpen,
    isProjectFormOpen,
  } = storeToRefs(popupsStore);
  const {
    setCurrentEditingTask,
    setCurrentEditingLabel,
    openTaskActionMenu,
    closeTaskActionMenu,
    openTaskLabelMenu,
    closeTaskLabelMenu,
    openLabelActionMenu,
    closeLabelActionMenu,
    openProjectForm,
    closeProjectForm,
  } = popupsStore;

  it('should have empty initial state', () => {
    expect(currentEditingTask.value).toBeNull();
    expect(currentEditingLabel.value).toBeNull();
    expect(isTaskActionMenuOpen.value).toBe(false);
    expect(isTaskLabelMenuOpen.value).toBe(false);
    expect(isLabelActionMenuOpen.value).toBe(false);
    expect(isProjectFormOpen.value).toBe(false);
  });

  it('should set current editing task and clear it with null', () => {
    const task: ITask = {
      id: '123',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
      labels: [],
    };

    setCurrentEditingTask(task);

    expect(currentEditingTask.value).toEqual(task);

    setCurrentEditingTask(null);

    expect(currentEditingTask.value).toBeNull();
  });

  it('should set current editing label and clear it with null', () => {
    const label: ILabel = {
      id: '123',
      name: 'test label',
      color: '#ffeeff',
      scopeTitle: 'test-scope',
    };

    setCurrentEditingLabel(label);

    expect(currentEditingLabel.value).toEqual(label);

    setCurrentEditingLabel(null);

    expect(currentEditingLabel.value).toBeNull();
  });

  it('should open and close task action menu and clear current task', () => {
    setCurrentEditingTask({
      id: '123',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
      labels: [],
    });
    openTaskActionMenu();

    expect(isTaskActionMenuOpen.value).toBe(true);

    closeTaskActionMenu();

    expect(isTaskActionMenuOpen.value).toBe(false);
    expect(currentEditingTask.value).toBeNull();
  });

  it('should open and close task label menu and clear current task', () => {
    setCurrentEditingTask({
      id: '123',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
      labels: [],
    });
    openTaskLabelMenu();

    expect(isTaskLabelMenuOpen.value).toBe(true);

    closeTaskLabelMenu();

    expect(isTaskLabelMenuOpen.value).toBe(false);
    expect(currentEditingTask.value).toBeNull();
  });

  it('should open and close label action menu and clear current label', () => {
    setCurrentEditingLabel({
      id: '123',
      name: 'test label',
      color: '#ffeeff',
      scopeTitle: 'test-scope',
    });
    openLabelActionMenu();

    expect(isLabelActionMenuOpen.value).toBe(true);

    closeLabelActionMenu();

    expect(isLabelActionMenuOpen.value).toBe(false);
    expect(currentEditingLabel.value).toBeNull();
  });

  it('should open and close project form', () => {
    openProjectForm();

    expect(isProjectFormOpen.value).toBe(true);

    closeProjectForm();

    expect(isProjectFormOpen.value).toBe(false);
  });
});
