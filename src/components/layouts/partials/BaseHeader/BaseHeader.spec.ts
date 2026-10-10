import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseHeader from '@/components/layouts/partials/BaseHeader/BaseHeader.vue';

describe('BaseHeader', () => {
  let wrapper: ComponentWrapperType<typeof BaseHeader>;
  let router: ReturnType<typeof createRouter>;

  const createComponent = async () => {
    router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/');
    await router.isReady();

    wrapper = mount(BaseHeader, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render its logo, navigation, and github image', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
    expect(wrapper.findComponent(BaseNavigation).exists()).toBe(true);
    expect(wrapper.find('[data-test-id="github-image"]').exists()).toBe(true);
  });
});
