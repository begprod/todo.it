import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFilterSearch from '@/components/BaseFilterSearch/BaseFilterSearch.vue';

describe('BaseFilterSearch', () => {
  let wrapper: ComponentWrapperType<typeof BaseFilterSearch>;

  const createComponent = () => {
    wrapper = mount(BaseFilterSearch, {
      global: {
        plugins: [],
      },
      props: {
        id: 'test-id',
        placeholder: 'test placeholder',
        searchItems: [],
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render list if items', async () => {
    await wrapper.setProps({
      searchItems: [
        {
          id: '1',
          name: 'test item',
          color: '#ffeeff',
          scopeTitle: 'test-scope',
          searchString: 'test item test-scope',
        },
      ],
    });

    const itemsList = wrapper.find('[data-test-id="items-search-list"]');

    expect(itemsList.html()).toContain('test item');
    expect(itemsList.html()).toContain('test-scope');
  });

  it('should render filtered list of items', async () => {
    await wrapper.setProps({
      searchItems: [
        {
          id: '1',
          name: 'some item',
          color: '#ffeeff',
          scopeTitle: 'some-scope',
          searchString: 'some item some-scope',
        },
        {
          id: '2',
          name: 'test item 2',
          color: '#ffeeff',
          scopeTitle: 'test-scope 2',
          searchString: 'test item 2 test-scope 2',
        },
      ],
    });

    wrapper.vm.searchQuery = 'test item 2';

    await wrapper.vm.$nextTick();

    const itemsList = wrapper.find('[data-test-id="items-search-list"]');

    expect(itemsList.html()).toContain('test item 2');
    expect(itemsList.html()).toContain('test-scope 2');
    expect(itemsList.html()).not.toContain('some item');
    expect(itemsList.html()).not.toContain('some-scope');
  });

  it('should render empty message if items is empty', async () => {
    const emptyMessage = wrapper.find('[data-test-id="empty-message"]');

    expect(emptyMessage.exists()).toBe(true);
  });

  it('should emit item-action event and clear search query', async () => {
    await wrapper.setProps({
      searchItems: [
        {
          id: '1',
          name: 'some item',
          color: '#ffeeff',
          scopeTitle: 'some-scope',
          searchString: 'some item some-scope',
        },
      ],
    });
    wrapper.vm.searchQuery = 'some item';

    const item = wrapper.find('[data-test-id="label-list-item"]');

    await item.trigger('click');

    expect(wrapper.emitted()['item-action']).toBeTruthy();
    expect(wrapper.vm.searchQuery).toBe('');
  });
});
