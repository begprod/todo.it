import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useCommonStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const commonStore = useCommonStore();
  const { lastCalendarUpdateDate, currentViewType, isToastVisible, message, status } =
    storeToRefs(commonStore);
  const { setLastUpdateDate, setViewType, setStatus, setMessage, showToast, closeToast } =
    commonStore;

  it('should be empty', () => {
    expect(lastCalendarUpdateDate.value).toEqual('');
  });

  it('should set last update date', () => {
    const date = '01.01.2021';

    setLastUpdateDate(date);

    expect(lastCalendarUpdateDate.value).toEqual(date);
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

  it('should set current view type', () => {
    expect(currentViewType.value).toEqual('rows');

    setViewType('columns');

    expect(currentViewType.value).toEqual('columns');
  });
});
