import type { ITask, ILabel, IScope } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useCommonStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const commonStore = useCommonStore();
  const {
    isBacklogOpen,
    lastCalendarUpdateDate,
    isTaskActionMenuOpen,
    isLabelActionMenuOpen,
    currentEditingTask,
    currentEditingLabel,
    isToastVisible,
    message,
    status,
  } = storeToRefs(commonStore);
  const {
    setLastUpdateDate,
    setCurrentEditingTask,
    setCurrentEditingLabel,
    toggleSidebar,
    openTaskActionMenu,
    closeTaskActionMenu,
    openLabelActionMenu,
    closeLabelActionMenu,
    setStatus,
    setMessage,
    showToast,
    closeToast,
  } = commonStore;

  it('should be empty', () => {
    expect(isBacklogOpen.value).toEqual(true);
    expect(lastCalendarUpdateDate.value).toEqual('');
    expect(isTaskActionMenuOpen.value).toEqual(false);
    expect(currentEditingTask.value).toEqual(null);
  });

  it('should set last update date', () => {
    const date = '01.01.2021';

    setLastUpdateDate(date);

    expect(lastCalendarUpdateDate.value).toEqual(date);
  });

  it('should set current editing task', () => {
    const task: ITask = {
      id: '123',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
    };

    setCurrentEditingTask(task);

    expect(currentEditingTask.value).toEqual(task);
  });

  it('should set current editing label', () => {
    const label: ILabel | IScope = {
      id: '123',
      name: 'test label',
      color: '#ffeeff',
      scopeTitle: 'test-scope',
    };

    setCurrentEditingLabel(label);

    expect(currentEditingLabel.value).toEqual(label);
  });

  it('should toggle sidebar', () => {
    toggleSidebar();

    expect(isBacklogOpen.value).toEqual(false);
  });

  it('should open task action menu', () => {
    openTaskActionMenu();

    expect(isTaskActionMenuOpen.value).toEqual(true);
  });

  it('should close task action menu', () => {
    closeTaskActionMenu();

    expect(isTaskActionMenuOpen.value).toEqual(false);
  });

  it('should open label action menu', () => {
    openLabelActionMenu();

    expect(isLabelActionMenuOpen.value).toEqual(true);
  });

  it('should close label action menu', () => {
    closeLabelActionMenu();

    expect(isLabelActionMenuOpen.value).toEqual(false);
  });

  it('should set status', () => {
    setStatus('success');

    expect(status.value).toEqual('success');
  });

  it('should set message', () => {
    setMessage('test message');

    expect(message.value).toEqual('test message');
  });

  it('should show toast', () => {
    showToast();

    expect(isToastVisible.value).toEqual(true);
  });

  it('should close toast', () => {
    closeToast();

    expect(isToastVisible.value).toEqual(false);
  });
});
