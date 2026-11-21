import type { ComponentWrapperType } from '@/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseMobileStub from '@/components/BaseMobileStub/BaseMobileStub.vue';

describe('BaseMobileStub', () => {
  let wrapper: ComponentWrapperType<typeof BaseMobileStub>;

  const createComponent = () => {
    wrapper = mount(BaseMobileStub);
  };

  beforeEach(createComponent);

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render the stub root element', () => {
    expect(wrapper.find('.stub').exists()).toBe(true);
  });

  it('should render BaseLogo', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
  });

  it('should render the mobile version message', () => {
    expect(wrapper.find('.stub__text').text()).toBe('Mobile version is coming soon.');
  });
});
