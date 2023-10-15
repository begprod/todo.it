import type { ITask } from '@/types';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useCommonStore } from '@/stores/common/common';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const commonStore = useCommonStore();
  const { isSidebarOpen, lastCalendarUpdateDate, isActionMenuOpen, currentEditingTask } =
    storeToRefs(commonStore);
  const { setLastUpdateDate, setCurrentEditingTask, toggleSidebar, toggleTaskActionMenu } =
    commonStore;

  it('should be empty', () => {
    expect(isSidebarOpen.value).toEqual(true);
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
      title: 'test title',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
    };

    setCurrentEditingTask(task);

    expect(currentEditingTask.value).toEqual(task);
  });

  it('should toggle sidebar', () => {
    toggleSidebar();

    expect(isSidebarOpen.value).toEqual(false);
  });

  it('should toggle task action menu', () => {
    toggleTaskActionMenu();

    expect(isActionMenuOpen.value).toEqual(true);
  });
});
