import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import type { ComponentWrapperType } from '@/types';
import { useCommonStore } from '@/stores';
import * as backup from '@/persistence/backup/backup';
import BaseSettingsBackup from '@/components/BaseSettings/partials/BaseSettingsBackup/BaseSettingsBackup.vue';

vi.mock('@/persistence/backup/backup', () => ({
  exportData: vi.fn(),
  importData: vi.fn(),
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

  it('should call exportData', async () => {
    await wrapper.find('[data-test-id="export-data-button"]').trigger('click');

    expect(backup.exportData).toHaveBeenCalled();
  });

  it('should call importData and reload the page', async () => {
    vi.mocked(backup.importData).mockResolvedValue(undefined);

    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });

    await wrapper.find('[data-test-id="import-data-button"]').trigger('click');
    await vi.waitFor(() => expect(window.location.reload).toHaveBeenCalled());

    expect(backup.importData).toHaveBeenCalled();
  });

  it('should show the import error message when importData rejects', async () => {
    vi.mocked(backup.importData).mockRejectedValue(
      new Error('Import is unavailable while storage is unavailable'),
    );
    const common = useCommonStore();

    await wrapper.find('[data-test-id="import-data-button"]').trigger('click');

    expect(common.setMessage).toHaveBeenCalledWith(
      'Import is unavailable while storage is unavailable',
    );
    expect(common.setStatus).toHaveBeenCalledWith('error');
    expect(common.showToast).toHaveBeenCalled();
  });
});
