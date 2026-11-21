import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type { ComponentWrapperType, IProject, ITask } from '@/types';
import { usePopupsStore, useProjectsStore, useTasksStore } from '@/stores';
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

    await nextTick();

    const cards = wrapper.findAll('.projects-list__item');

    expect(cards).toHaveLength(2);
    expect(cards[0].find('.projects-list__item-title').text()).toBe('Project A');
    expect(cards[0].find('.projects-list__item-description').text()).toBe('Priority: 2');
    expect(cards[1].find('.projects-list__item-title').text()).toBe('Project B');
    expect(cards[1].find('.projects-list__item-description').text()).toBe('Priority: 5');
  });

  it('should show done/overall counts across days and backlog, ignoring unassigned tasks', async () => {
    const projectsStore = useProjectsStore();
    const tasksStore = useTasksStore();
    const projectA: IProject = {
      id: 'project-a',
      title: 'Project A',
      color: '#123456',
      priority: 2,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };
    const projectB: IProject = { ...projectA, id: 'project-b', title: 'Project B' };
    const task: ITask = {
      id: 'task-a',
      description: '',
      dayId: '06112026',
      isDone: true,
      labels: [],
      projectId: projectA.id,
    };

    projectsStore.projects = [projectA, projectB];
    tasksStore.tasks = {
      '06112026': {
        items: [task, { ...task, id: 'unassigned', projectId: undefined }],
      },
      '07112026': {
        items: [{ ...task, id: 'task-b', dayId: '07112026', isDone: false }],
      },
      backlog: {
        items: [{ ...task, id: 'task-c', dayId: 'backlog' }],
      },
    };

    await nextTick();

    const cards = wrapper.findAll('.projects-list__item');

    expect(cards[0].findAll('.projects-list__item-description')[1].text()).toBe('Tasks: 2/3');
    expect(cards[1].findAll('.projects-list__item-description')[1].text()).toBe('Tasks: 0/0');
  });

  it('should open the edit form for the clicked project', async () => {
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();
    const project: IProject = {
      id: 'project-a',
      title: 'Project A',
      color: '#123456',
      priority: 2,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };

    projectsStore.projects = [project];

    await nextTick();
    await wrapper.find('.projects-list__item').trigger('click');

    expect(popupsStore.setCurrentEditingProject).toHaveBeenCalledWith(project);
    expect(popupsStore.openProjectEditForm).toHaveBeenCalledOnce();
  });
});
