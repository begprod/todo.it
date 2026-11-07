import type { ITask, ILabel, IProject } from '@/types';
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
    currentEditingProject,
    isTaskActionMenuOpen,
    isTaskLabelMenuOpen,
    isLabelActionMenuOpen,
    isProjectFormOpen,
    isProjectEditFormOpen,
  } = storeToRefs(popupsStore);
  const {
    setCurrentEditingTask,
    setCurrentEditingLabel,
    setCurrentEditingProject,
    openTaskActionMenu,
    closeTaskActionMenu,
    openTaskLabelMenu,
    closeTaskLabelMenu,
    openLabelActionMenu,
    closeLabelActionMenu,
    openProjectForm,
    closeProjectForm,
    openProjectEditForm,
    closeProjectEditForm,
  } = popupsStore;

  it('should have empty initial state', () => {
    expect(currentEditingTask.value).toBeNull();
    expect(currentEditingLabel.value).toBeNull();
    expect(currentEditingProject.value).toBeNull();
    expect(isTaskActionMenuOpen.value).toBe(false);
    expect(isTaskLabelMenuOpen.value).toBe(false);
    expect(isLabelActionMenuOpen.value).toBe(false);
    expect(isProjectFormOpen.value).toBe(false);
    expect(isProjectEditFormOpen.value).toBe(false);
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

  it('should set current editing project and clear it with null', () => {
    const project: IProject = {
      id: 'project-123',
      title: 'Test project',
      color: '#ffeeff',
      priority: 3,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };

    setCurrentEditingProject(project);

    expect(currentEditingProject.value).toEqual(project);

    setCurrentEditingProject(null);

    expect(currentEditingProject.value).toBeNull();
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

  it('should open and close project edit form and clear current project', () => {
    setCurrentEditingProject({
      id: 'project-123',
      title: 'Test project',
      color: '#ffeeff',
      priority: 3,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    });
    openProjectEditForm();

    expect(isProjectEditFormOpen.value).toBe(true);

    closeProjectEditForm();

    expect(isProjectEditFormOpen.value).toBe(false);
    expect(currentEditingProject.value).toBeNull();
  });
});
