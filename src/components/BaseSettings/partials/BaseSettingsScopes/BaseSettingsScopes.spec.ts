import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { useLabelsStore, usePopupsStore } from '@/stores';
import BaseSettingsScopes from '@/components/BaseSettings/partials/BaseSettingsScopes/BaseSettingsScopes.vue';

describe('BaseSettingsScopes', () => {
  let wrapper: ComponentWrapperType<typeof BaseSettingsScopes>;
  let target: HTMLDivElement;

  const createComponent = async () => {
    target = document.createElement('div');
    target.id = 'settings-actions';
    document.body.append(target);

    wrapper = mount(BaseSettingsScopes, {
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

  it('should teleport add button and open scope form', async () => {
    const popupsStore = usePopupsStore();

    expect(wrapper.find('#add-scope-form').exists()).toBe(false);
    expect(document.querySelector('#settings-actions button')).not.toBeNull();

    (document.querySelector('#settings-actions button') as HTMLButtonElement).click();

    expect(popupsStore.openScopeForm).toHaveBeenCalledTimes(1);
  });

  it('should render the scope list only when scopes exist', async () => {
    const labelsStore = useLabelsStore();

    expect(wrapper.findComponent({ name: 'BaseLabelList' }).exists()).toBe(false);

    labelsStore.scopes = [{ id: 'scope-1', name: 'Work', color: '#abcdef' }];
    await flushPromises();

    expect(wrapper.findComponent({ name: 'BaseLabelList' }).exists()).toBe(true);
  });
});
