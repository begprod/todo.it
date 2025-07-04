import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import * as helpers from '@/helpers';
import { useCommonStore } from '@/stores';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';

vi.mock('@/helpers', () => ({
  exportDataFromLocalStorage: vi.fn(),
  importDataToLocalStorage: vi.fn(),
}));

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

  it('should render import/export buttons', async () => {
    const accordionButtons = wrapper.findAll('button[title="Collapse/Expand"]');
    let exportButton = wrapper.find('[data-test-id="export-data-button"]');
    let importButton = wrapper.find('[data-test-id="import-data-button"]');

    expect(exportButton.exists()).toBe(false);
    expect(importButton.exists()).toBe(false);

    await accordionButtons[2].trigger('click');

    exportButton = wrapper.find('[data-test-id="export-data-button"]');
    importButton = wrapper.find('[data-test-id="import-data-button"]');

    expect(exportButton.exists()).toBe(true);
    expect(importButton.exists()).toBe(true);
  });

  it('should call exportDataFromLocalStorage', async () => {
    const exportButton = wrapper.find('[data-test-id="export-data-button"]');

    await exportButton.trigger('click');

    expect(helpers.exportDataFromLocalStorage).toHaveBeenCalledWith([
      'todo:scopes',
      'todo:labels',
      'todo.it:tasks',
    ]);
  });

  it('should call importDataToLocalStorage', async () => {
    // @ts-ignore
    helpers.importDataToLocalStorage.mockResolvedValue(undefined);

    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });

    const importButton = wrapper.find('[data-test-id="import-data-button"]');
    await importButton.trigger('click');

    expect(helpers.importDataToLocalStorage).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
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
