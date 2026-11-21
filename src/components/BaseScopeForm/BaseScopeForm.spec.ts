import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { useCommonStore, useLabelsStore, usePopupsStore } from '@/stores';
import BaseScopeForm from '@/components/BaseScopeForm/BaseScopeForm.vue';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';

describe('BaseScopeForm', () => {
  let wrapper: ComponentWrapperType<typeof BaseScopeForm>;

  const createComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });

    setActivePinia(pinia);
    usePopupsStore().isScopeFormOpen = true;

    wrapper = mount(BaseScopeForm, { global: { plugins: [pinia] } });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render only when scope form is open', async () => {
    expect(wrapper.find('#add-scope-form').exists()).toBe(true);

    usePopupsStore().isScopeFormOpen = false;
    await flushPromises();

    expect(wrapper.find('#add-scope-form').exists()).toBe(false);
  });

  it('should create scope and close form on submit', async () => {
    const labelsStore = useLabelsStore();
    const popupsStore = usePopupsStore();

    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Work');
    wrapper.findComponent({ name: 'ColorPicker' }).vm.$emit('update:pureColor', '#abcdef');
    await wrapper.find('#add-scope-form').trigger('submit');

    expect(labelsStore.createScope).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Work', color: '#abcdef' }),
    );
    expect(wrapper.findComponent({ name: 'BaseInput' }).props('modelValue')).toBe('');
    expect(popupsStore.closeScopeForm).toHaveBeenCalledTimes(1);
  });

  it('should show validation toast for empty scope name', async () => {
    const labelsStore = useLabelsStore();
    const popupsStore = usePopupsStore();
    const commonStore = useCommonStore();

    await wrapper.find('#add-scope-form').trigger('submit');

    expect(labelsStore.createScope).not.toHaveBeenCalled();
    expect(popupsStore.closeScopeForm).not.toHaveBeenCalled();
    expect(commonStore.setMessage).toHaveBeenCalledWith('Please enter scope name');
    expect(commonStore.setStatus).toHaveBeenCalledWith('error');
    expect(commonStore.showToast).toHaveBeenCalledTimes(1);
  });

  it('should close popup and reset draft when popup emits close', async () => {
    const popupsStore = usePopupsStore();

    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Draft');
    wrapper.findComponent(BasePopup).vm.$emit('close');
    popupsStore.isScopeFormOpen = false;
    await flushPromises();

    expect(popupsStore.closeScopeForm).toHaveBeenCalledTimes(1);

    popupsStore.isScopeFormOpen = true;
    await flushPromises();

    expect(wrapper.findComponent({ name: 'BaseInput' }).props('modelValue')).toBe('');
  });
});
