import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { useCommonStore, useLabelsStore, usePopupsStore } from '@/stores';
import BaseLabelForm from '@/components/BaseLabelForm/BaseLabelForm.vue';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';

describe('BaseLabelForm', () => {
  let wrapper: ComponentWrapperType<typeof BaseLabelForm>;

  const createComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });

    setActivePinia(pinia);
    usePopupsStore().isLabelFormOpen = true;

    wrapper = mount(BaseLabelForm, { global: { plugins: [pinia] } });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render only when label form is open', async () => {
    expect(wrapper.find('#add-label-form').exists()).toBe(true);

    usePopupsStore().isLabelFormOpen = false;
    await flushPromises();

    expect(wrapper.find('#add-label-form').exists()).toBe(false);
  });

  it('should create label without scope and close the form', async () => {
    const labelsStore = useLabelsStore();
    const popupsStore = usePopupsStore();

    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Urgent');
    await wrapper.find('#add-label-form').trigger('submit');

    expect(labelsStore.createLabel).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Urgent', color: '#000000', scopeTitle: null }),
    );
    expect(popupsStore.closeLabelForm).toHaveBeenCalledTimes(1);
  });

  it('should use selected scope color and hide color picker', async () => {
    const labelsStore = useLabelsStore();
    labelsStore.scopes = [{ id: 'scope-1', name: 'Work', color: '#112233' }];
    await flushPromises();

    wrapper.findComponent({ name: 'BaseSelect' }).vm.$emit('update:modelValue', 'Work');
    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Urgent');
    await flushPromises();

    expect(wrapper.find('.label-form__preview').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ColorPicker' }).exists()).toBe(false);

    await wrapper.find('#add-label-form').trigger('submit');

    expect(labelsStore.createLabel).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Urgent', color: '#112233', scopeTitle: 'Work' }),
    );
  });

  it('should render empty scope options and color picker without scopes', () => {
    expect(wrapper.findComponent({ name: 'BaseSelect' }).props('options')).toEqual([]);
    expect(wrapper.findComponent({ name: 'ColorPicker' }).exists()).toBe(true);
  });

  it('should show validation toast for empty label name', async () => {
    const labelsStore = useLabelsStore();
    const popupsStore = usePopupsStore();
    const commonStore = useCommonStore();

    await wrapper.find('#add-label-form').trigger('submit');

    expect(labelsStore.createLabel).not.toHaveBeenCalled();
    expect(popupsStore.closeLabelForm).not.toHaveBeenCalled();
    expect(commonStore.setMessage).toHaveBeenCalledWith('Please enter label name');
    expect(commonStore.showToast).toHaveBeenCalledTimes(1);
  });

  it('should close popup and reset draft when popup emits close', async () => {
    const popupsStore = usePopupsStore();

    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Draft');
    wrapper.findComponent(BasePopup).vm.$emit('close');
    popupsStore.isLabelFormOpen = false;
    await flushPromises();

    expect(popupsStore.closeLabelForm).toHaveBeenCalledTimes(1);

    popupsStore.isLabelFormOpen = true;
    await flushPromises();

    expect(wrapper.findComponent({ name: 'BaseInput' }).props('modelValue')).toBe('');
  });
});
