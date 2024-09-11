import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';

describe('BasePopup', () => {
  let wrapper: ComponentWrapperType<typeof BasePopup>;

  const createComponent = () => {
    wrapper = mount(BasePopup, {
      props: {
        isVisible: false,
      },
      slots: {
        default: 'Slot content',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should showing popup when prop isVisible is true', async () => {
    await wrapper.setProps({ isVisible: true });

    const popupContainer = wrapper.find('[data-test-id="popup-container"]');
    const popupContent = wrapper.find('[data-test-id="popup-content"]');

    expect(popupContainer.exists()).toBe(true);
    expect(popupContent.exists()).toBe(true);
    expect(wrapper.html()).toContain('Slot content');
  });

  it('should hiding popup when prop isVisible is false', async () => {
    await wrapper.setProps({ isVisible: false });

    const popupContainer = wrapper.find('[data-test-id="popup-container"]');
    const popupContent = wrapper.find('[data-test-id="popup-content"]');

    expect(popupContainer.exists()).toBe(false);
    expect(popupContent.exists()).toBe(false);
    expect(wrapper.html()).not.toContain('Slot content');
  });

  it('should call emit close event on popup backdrop click', async () => {
    await wrapper.setProps({ isVisible: true });

    await wrapper.find('[data-testid="popup-backdrop"]').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
