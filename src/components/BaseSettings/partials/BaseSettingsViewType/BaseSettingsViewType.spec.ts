import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useCommonStore } from '@/stores';
import BaseSettingsViewType from '@/components/BaseSettings/partials/BaseSettingsViewType/BaseSettingsViewType.vue';

describe('BaseSettingsViewType', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsViewType>;

  const createComponent = () => {
    wrapper = mount(BaseSettingsViewType, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render change view type buttons', () => {
    expect(wrapper.find('[data-test-id="view-type-rows-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="view-type-columns-button"]').exists()).toBe(true);
  });

  it('should call setViewType with rows on rows button click', async () => {
    const commonStore = useCommonStore();

    await wrapper.find('[data-test-id="view-type-rows-button"]').trigger('click');

    expect(commonStore.setViewType).toHaveBeenCalledWith('rows');
  });

  it('should call setViewType with columns on columns button click', async () => {
    const commonStore = useCommonStore();

    await wrapper.find('[data-test-id="view-type-columns-button"]').trigger('click');

    expect(commonStore.setViewType).toHaveBeenCalledWith('columns');
  });
});
