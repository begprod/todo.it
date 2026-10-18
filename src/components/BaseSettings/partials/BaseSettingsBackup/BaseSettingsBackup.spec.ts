import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import * as helpers from '@/helpers';
import BaseSettingsBackup from '@/components/BaseSettings/partials/BaseSettingsBackup/BaseSettingsBackup.vue';

vi.mock('@/helpers', () => ({
  exportDataFromLocalStorage: vi.fn(),
  importDataToLocalStorage: vi.fn(),
}));

describe('BaseSettingsBackup', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsBackup>;

  const createComponent = () => {
    wrapper = mount(BaseSettingsBackup, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render import/export buttons', () => {
    expect(wrapper.find('[data-test-id="export-data-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="import-data-button"]').exists()).toBe(true);
  });

  it('should call exportDataFromLocalStorage', async () => {
    await wrapper.find('[data-test-id="export-data-button"]').trigger('click');

    expect(helpers.exportDataFromLocalStorage).toHaveBeenCalledWith([
      'todo:scopes',
      'todo:labels',
      'todo.it:tasks',
    ]);
  });

  it('should call importDataToLocalStorage and reload the page', async () => {
    // @ts-ignore
    helpers.importDataToLocalStorage.mockResolvedValue(undefined);

    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });

    await wrapper.find('[data-test-id="import-data-button"]').trigger('click');
    await vi.waitFor(() => expect(window.location.reload).toHaveBeenCalled());

    expect(helpers.importDataToLocalStorage).toHaveBeenCalled();
  });
});
