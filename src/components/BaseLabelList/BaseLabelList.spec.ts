import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BaseLabelList from '@/components/BaseLabelList/BaseLabelList.vue';

describe('BaseLabelList', () => {
  let wrapper: ComponentWrapperType<typeof BaseLabelList>;

  const createComponent = () => {
    wrapper = shallowMount(BaseLabelList, {
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
});