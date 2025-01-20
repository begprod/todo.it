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

  it('should not render title if title props is empty', async () => {
    await wrapper.setProps({ title: '' });

    const title = wrapper.find('[data-test-id="label-list-title"]');

    expect(title.exists()).toBe(false);
  });

  it('should render sorted list of labels', async () => {
    await wrapper.setProps({
      labels: [
        {
          id: '1',
          name: 'z test label',
          color: '#ffffff',
          scopeTitle: null,
        },
        {
          id: '2',
          name: 'test label',
          color: '#eeeeee',
          scopeTitle: null,
        },
        {
          id: '3',
          name: 'A test label',
          color: '#fefefe',
          scopeTitle: null,
        },
      ],
    });

    const labelColor = wrapper.findAll('[data-test-id="label-list-item-color"]');
    const labelName = wrapper.findAll('[data-test-id="label-list-item-name"]');

    expect(labelColor[0].attributes('style')).toContain('background-color: rgb(254, 254, 254)');
    expect(labelName[0].text()).toBe('A test label');
    expect(labelColor[1].attributes('style')).toContain('background-color: rgb(238, 238, 238)');
    expect(labelName[1].text()).toBe('test label');
    expect(labelColor[2].attributes('style')).toContain('background-color: rgb(255, 255, 255)');
    expect(labelName[2].text()).toBe('z test label');
  });

  it('should render sorted and grouped by scope list of labels', async () => {
    await wrapper.setProps({
      labels: [
        {
          id: '1',
          name: 'z test label',
          color: '#ffffff',
          scopeTitle: 'A some scope',
        },
        {
          id: '2',
          name: 'test label',
          color: '#ffeeff',
          scopeTitle: 'test-scope',
        },
        {
          id: '3',
          name: 'A test label',
          color: '#fefefe',
          scopeTitle: 'A some scope',
        },
      ],
    });

    const labelScopeTitle = wrapper.findAll('[data-test-id="label-list-item-scope"]');

    expect(labelScopeTitle[0].text()).toBe('A some scope');
    expect(labelScopeTitle[1].text()).toBe('A some scope');
    expect(labelScopeTitle[2].text()).toBe('test-scope');
  });

  it('should render action button if props is showLabelActionMenu is true', async () => {
    await wrapper.setProps({
      showLabelActionMenu: true,
      labels: [{ id: '1', name: 'test label', color: '#ffffff', scopeTitle: null }],
    });

    const actionsButton = wrapper.find('[data-test-id="label-list-item-actions-button"]');

    expect(actionsButton.exists()).toBe(true);
  });

  it('should not render actions button if props is showLabelActionMenu is false', async () => {
    await wrapper.setProps({
      showLabelActionMenu: false,
      labels: [{ id: '1', name: 'test label', color: '#ffffff', scopeTitle: null }],
    });

    const actionsButton = wrapper.find('[data-test-id="label-list-item-actions-button"]');

    expect(actionsButton.exists()).toBe(false);
  });

  it('should call openLabelActionMenu when clicking on actions button', async () => {
    await wrapper.setProps({
      showLabelActionMenu: true,
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

  it('should call onItemAction on label item click', async () => {
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

    const onItemActionSpy = vi.spyOn(wrapper.vm, 'onItemAction');
    const label = wrapper.find('[data-test-id="label-list-item"]');

    await label.trigger('click');

    expect(onItemActionSpy).toHaveBeenCalled();
  });
});
