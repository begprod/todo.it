import type { ITask } from '@/types';
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
    isActionMenuOpen,
    currentEditingTask,
    isToastVisible,
    message,
    status,
  } = storeToRefs(commonStore);
  const {
    setLastUpdateDate,
    setCurrentEditingTask,
    toggleSidebar,
    openTaskActionMenu,
    closeTaskActionMenu,
    setStatus,
    setMessage,
    showToast,
    closeToast,
  } = commonStore;

  it('should be empty', () => {
    expect(isBacklogOpen.value).toEqual(true);
    expect(lastCalendarUpdateDate.value).toEqual('');
    expect(isActionMenuOpen.value).toEqual(false);
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

  it('should toggle sidebar', () => {
    toggleSidebar();

    expect(isBacklogOpen.value).toEqual(false);
  });

  it('should open task action menu', () => {
    openTaskActionMenu();

    expect(isActionMenuOpen.value).toEqual(true);
  });

  it('should close task action menu', () => {
    closeTaskActionMenu();

    expect(isActionMenuOpen.value).toEqual(false);
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
