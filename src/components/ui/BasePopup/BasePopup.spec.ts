import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
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

  it('should call emit close event on Escape key', async () => {
    await wrapper.setProps({ isVisible: true });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should not emit close event on Escape key when popup is hidden', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(wrapper.emitted('close')).toBeUndefined();
  });
});
