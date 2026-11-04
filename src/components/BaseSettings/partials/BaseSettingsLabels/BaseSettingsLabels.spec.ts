import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useLabelsStore } from '@/stores';
import BaseSettingsLabels from '@/components/BaseSettings/partials/BaseSettingsLabels/BaseSettingsLabels.vue';

describe('BaseSettingsLabels', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsLabels>;

  const createComponent = () => {
    wrapper = mount(BaseSettingsLabels, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render add label form', () => {
    expect(wrapper.find('#add-label-form').exists()).toBe(true);
  });

  it('should call createLabel on label submit', async () => {
    const labelsStore = useLabelsStore();

    wrapper.findAllComponents({ name: 'BaseInput' })[0].vm.$emit('update:modelValue', 'Urgent');
    await wrapper.find('#add-label-form').trigger('submit');

    expect(labelsStore.createLabel).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Urgent', color: '#000000', scopeTitle: null }),
    );
  });
});
