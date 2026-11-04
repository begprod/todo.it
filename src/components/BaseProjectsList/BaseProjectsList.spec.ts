import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import type { ComponentWrapperType } from '@/types';
import BaseProjectsList from '@/components/BaseProjectsList/BaseProjectsList.vue';

describe('BaseProjectsList', () => {
  let wrapper: ComponentWrapperType<typeof BaseProjectsList>;

  const createComponent = () => {
    wrapper = mount(BaseProjectsList, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render the project cards with their titles and task counts', () => {
    const items = wrapper.findAll('.projects-list__item');

    expect(items).toHaveLength(13);
    expect(items[0].find('.projects-list__item-title').text()).toBe('budget.it');
    expect(items[0].find('.projects-list__item-description').text()).toBe('tasks: 10/100');
    expect(items[3].find('.projects-list__item-title').text()).toBe('Todo.it');
  });
});
