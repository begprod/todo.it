import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useCommonStore } from '@/stores';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';

describe('BaseSettings', () => {
  const wrapper = mount(BaseSettings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const commonStore = useCommonStore();
  const { isSettingsOpen } = storeToRefs(commonStore);

  isSettingsOpen.value = true;

  it('should render add scope form', async () => {
    const accordionButtons = wrapper.findAll('button[title="Collapse/Expand"]');

    await accordionButtons[0].trigger('click');

    const form = wrapper.find('#add-scope-form');

    expect(form.exists()).toBe(true);
  });

  it('should render add label form', async () => {
    const accordionButtons = wrapper.findAll('button[title="Collapse/Expand"]');

    await accordionButtons[1].trigger('click');

    const form = wrapper.find('#add-label-form');

    expect(form.exists()).toBe(true);
  });

  it('should call submitNewScope on scope submit', async () => {
    const form = wrapper.find('#add-scope-form');
    const submitNewScope = vi.spyOn(wrapper.vm, 'submitNewScope');

    await form.trigger('submit');

    expect(submitNewScope).toHaveBeenCalled();
  });

  it('should call submitNewLabel on label submit', async () => {
    const form = wrapper.find('#add-label-form');
    const submitNewLabel = vi.spyOn(wrapper.vm, 'submitNewLabel');

    await form.trigger('submit');

    expect(submitNewLabel).toHaveBeenCalled();
  });
});
