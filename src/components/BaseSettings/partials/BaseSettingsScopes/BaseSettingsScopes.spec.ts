import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useLabelsStore } from '@/stores';
import BaseSettingsScopes from '@/components/BaseSettings/partials/BaseSettingsScopes/BaseSettingsScopes.vue';

describe('BaseSettingsScopes', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsScopes>;

  const createComponent = () => {
    wrapper = mount(BaseSettingsScopes, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render add scope form', () => {
    expect(wrapper.find('#add-scope-form').exists()).toBe(true);
  });

  it('should call createScope on scope submit', async () => {
    const labelsStore = useLabelsStore();

    wrapper.findComponent({ name: 'BaseInput' }).vm.$emit('update:modelValue', 'Work');
    await wrapper.find('#add-scope-form').trigger('submit');

    expect(labelsStore.createScope).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Work', color: '#000000' }),
    );
  });
});
