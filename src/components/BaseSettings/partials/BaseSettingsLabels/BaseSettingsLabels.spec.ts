import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { useLabelsStore, usePopupsStore } from '@/stores';
import BaseSettingsLabels from '@/components/BaseSettings/partials/BaseSettingsLabels/BaseSettingsLabels.vue';

describe('BaseSettingsLabels', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsLabels>;
  let target: HTMLDivElement;

  const createComponent = async () => {
    target = document.createElement('div');
    target.id = 'settings-actions';
    document.body.append(target);

    wrapper = mount(BaseSettingsLabels, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });

    await flushPromises();
  };

  beforeEach(createComponent);
  afterEach(() => {
    wrapper.unmount();
    target.remove();
  });

  it('should teleport add button and open label form', () => {
    const popupsStore = usePopupsStore();

    expect(wrapper.find('#add-label-form').exists()).toBe(false);
    expect(document.querySelector('#settings-actions button')).not.toBeNull();

    (document.querySelector('#settings-actions button') as HTMLButtonElement).click();

    expect(popupsStore.openLabelForm).toHaveBeenCalledTimes(1);
  });

  it('should render the label list only when labels exist', async () => {
    const labelsStore = useLabelsStore();

    expect(wrapper.findComponent({ name: 'BaseLabelList' }).exists()).toBe(false);

    labelsStore.labels = [{ id: 'label-1', name: 'Urgent', color: '#abcdef', scopeTitle: null }];
    await flushPromises();

    expect(wrapper.findComponent({ name: 'BaseLabelList' }).exists()).toBe(true);
  });
});
