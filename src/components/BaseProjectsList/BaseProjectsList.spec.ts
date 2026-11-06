import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import type { ComponentWrapperType, IProject } from '@/types';
import { useProjectsStore } from '@/stores';
import BaseProjectsList from '@/components/BaseProjectsList/BaseProjectsList.vue';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

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

  it('should show the empty state when there are no projects', () => {
    const emptyMessage = wrapper.findComponent(BaseEmptyListMessage);

    expect(emptyMessage.exists()).toBe(true);
    expect(emptyMessage.props('message')).toBe('Projects list is empty');
  });

  it('should render one card per project with its title and priority', async () => {
    const projectsStore = useProjectsStore();
    const projects: Array<IProject> = [
      {
        id: 'project-a',
        title: 'Project A',
        color: '#123456',
        priority: 2,
        createdAt: '2026-11-06T00:00:00.000Z',
        updatedAt: '2026-11-06T00:00:00.000Z',
      },
      {
        id: 'project-b',
        title: 'Project B',
        color: '#abcdef',
        priority: 5,
        createdAt: '2026-11-06T00:00:00.000Z',
        updatedAt: '2026-11-06T00:00:00.000Z',
      },
    ];
    projectsStore.projects = projects;

    await wrapper.vm.$nextTick();

    const cards = wrapper.findAll('.projects-list__item');

    expect(cards).toHaveLength(2);
    expect(cards[0].find('.projects-list__item-title').text()).toBe('Project A');
    expect(cards[0].find('.projects-list__item-description').text()).toBe('Priority: 2');
    expect(cards[1].find('.projects-list__item-title').text()).toBe('Project B');
    expect(cards[1].find('.projects-list__item-description').text()).toBe('Priority: 5');
  });
});
