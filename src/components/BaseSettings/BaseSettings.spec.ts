import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import * as helpers from '@/helpers';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';

vi.mock('@/helpers', () => ({
  exportDataFromLocalStorage: vi.fn(),
  importDataToLocalStorage: vi.fn(),
}));

describe('BaseSettings', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettings>;

  const createComponent = () => {
    wrapper = mount(BaseSettings, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  const openAccordion = async (index: number) => {
    const buttons = wrapper.findAll('button[title="Collapse/Expand"]');
    await buttons[index].trigger('click');
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render add scope form', async () => {
    await openAccordion(0);

    const form = wrapper.find('#add-scope-form');

    expect(form.exists()).toBe(true);
  });

  it('should render add label form', async () => {
    await openAccordion(1);

    const form = wrapper.find('#add-label-form');

    expect(form.exists()).toBe(true);
  });

  it('should render change view type buttons', async () => {
    let rowsViewButton = wrapper.find('[data-test-id="view-type-rows-button"]');
    let columnsViewButton = wrapper.find('[data-test-id="view-type-columns-button"]');

    expect(rowsViewButton.exists()).toBe(false);
    expect(columnsViewButton.exists()).toBe(false);

    await openAccordion(2);

    rowsViewButton = wrapper.find('[data-test-id="view-type-rows-button"]');
    columnsViewButton = wrapper.find('[data-test-id="view-type-columns-button"]');

    expect(rowsViewButton.exists()).toBe(true);
    expect(columnsViewButton.exists()).toBe(true);
  });

  it('should render import/export buttons', async () => {
    let exportButton = wrapper.find('[data-test-id="export-data-button"]');
    let importButton = wrapper.find('[data-test-id="import-data-button"]');

    expect(exportButton.exists()).toBe(false);
    expect(importButton.exists()).toBe(false);

    await openAccordion(3);

    exportButton = wrapper.find('[data-test-id="export-data-button"]');
    importButton = wrapper.find('[data-test-id="import-data-button"]');

    expect(exportButton.exists()).toBe(true);
    expect(importButton.exists()).toBe(true);
  });

  it('should call exportDataFromLocalStorage', async () => {
    await openAccordion(3);

    const exportButton = wrapper.find('[data-test-id="export-data-button"]');

    await exportButton.trigger('click');

    expect(helpers.exportDataFromLocalStorage).toHaveBeenCalledWith([
      'todo:scopes',
      'todo:labels',
      'todo.it:tasks',
    ]);
  });

  it('should call importDataToLocalStorage', async () => {
    await openAccordion(3);

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
    await openAccordion(0);

    const form = wrapper.find('#add-scope-form');
    const submitNewScope = vi.spyOn(wrapper.vm, 'submitNewScope');

    await form.trigger('submit');

    expect(submitNewScope).toHaveBeenCalled();
  });

  it('should call submitNewLabel on label submit', async () => {
    await openAccordion(1);

    const form = wrapper.find('#add-label-form');
    const submitNewLabel = vi.spyOn(wrapper.vm, 'submitNewLabel');

    await form.trigger('submit');

    expect(submitNewLabel).toHaveBeenCalled();
  });
});
