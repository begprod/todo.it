import type { ComponentWrapperType } from '@/types';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

describe('BaseLabelList', () => {
  let wrapper: ComponentWrapperType<typeof BaseLabelList>;

  const createComponent = () => {
    wrapper = mount(BaseLabelList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: {
        title: 'test title',
        labels: [],
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render title', () => {
    const title = wrapper.find('[data-test-id="label-list-title"]');

    expect(title.text()).toBe('test title:');
  });

  it('should render list of labels', async () => {
    await wrapper.setProps({
      labels: [
        {
          id: '1',
          name: 'test label',
          color: '#ffeeff',
          scopeTitle: null,
        },
      ],
    });

    const labelColor = wrapper.find('[data-test-id="label-list-item-color"]');
    const labelName = wrapper.find('[data-test-id="label-list-item-name"]');

    expect(labelColor.attributes('style')).toContain('background-color: rgb(255, 238, 255)');
    expect(labelName.text()).toBe('test label');
  });

  it('should render list of labels with scopes', async () => {
    await wrapper.setProps({
      labels: [
        {
          id: '1',
          name: 'test label',
          color: '#ffeeff',
          scopeTitle: 'test-scope',
        },
      ],
    });

    const labelScopeTitle = wrapper.find('[data-test-id="label-list-item-scope"]');

    expect(labelScopeTitle.text()).toBe('test-scope');
  });

  it('should call openLabelActionMenu when clicking on actions button', async () => {
    await wrapper.setProps({
      labels: [
        {
          id: '1',
          name: 'test label',
          color: '#ffeeff',
          scopeTitle: 'test-scope',
        },
      ],
    });

    const openLabelActionMenuSpy = vi.spyOn(wrapper.vm, 'openActionMenu');
    const actionsButton = wrapper.find('[data-test-id="label-list-item-actions-button"]');

    await actionsButton.trigger('click');

    expect(openLabelActionMenuSpy).toHaveBeenCalled();
  });
});
