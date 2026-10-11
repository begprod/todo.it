import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '@/router';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseNavigation from '@/components/layouts/partials/BaseNavigation/BaseNavigation.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';
import BaseSidebar from '@/components/layouts/partials/BaseSidebar/BaseSidebar.vue';

describe('BaseSidebar', () => {
  let wrapper: ComponentWrapperType<typeof BaseSidebar>;

  const createComponent = async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/');
    await router.isReady();

    wrapper = mount(BaseSidebar, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render its logo, navigation, and footer', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
    expect(wrapper.findComponent(BaseNavigation).exists()).toBe(true);
    expect(wrapper.findComponent(BaseFooter).exists()).toBe(true);
  });

  it('should render its inner and footer sections', () => {
    expect(wrapper.find('.sidebar__inner').exists()).toBe(true);
    expect(wrapper.find('.sidebar__footer').exists()).toBe(true);
  });
});
