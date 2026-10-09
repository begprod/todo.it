import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useCommonStore } from '@/stores';
import { routes } from '@/router';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';

describe('BaseHeader', () => {
  let wrapper: ComponentWrapperType<typeof BaseHeader>;
  let router: ReturnType<typeof createRouter>;
  let commonStore: ReturnType<typeof useCommonStore>;

  const createComponent = async () => {
    router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/');
    await router.isReady();

    wrapper = mount(BaseHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
      },
    });
    await flushPromises();
    commonStore = useCommonStore();
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render its logo, navigation, github image, and settings button', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
    expect(wrapper.findComponent(BaseNavigation).exists()).toBe(true);
    expect(wrapper.find('[data-test-id="github-image"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="toggle-settings-button"]').exists()).toBe(true);
  });

  it('should toggle settings when the settings button is clicked', async () => {
    await wrapper.find('[data-test-id="toggle-settings-button"]').trigger('click');

    expect(commonStore.toggleSettings).toHaveBeenCalledTimes(1);
  });
});
