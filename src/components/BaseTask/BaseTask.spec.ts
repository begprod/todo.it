import type { ComponentWrapperType, IProject } from '@/types';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';
import { useProjectsStore } from '@/stores';

describe('BaseTask', () => {
  let wrapper: ComponentWrapperType<typeof BaseTask>;
  const project: IProject = {
    id: 'project',
    title: 'Project title',
    color: '#abcdef',
    priority: 1,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
  };

  const createComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });

    setActivePinia(pinia);
    useProjectsStore().projects = [{ ...project }];

    wrapper = mount(BaseTask, {
      props: {
        task: {
          id: '123',
          description: 'Test',
          isDone: false,
          dayId: 'backlog',
          labels: [],
        },
      },
      global: {
        plugins: [pinia],
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should show the title of the task project', async () => {
    await wrapper.setProps({ task: { ...wrapper.props('task'), projectId: project.id } });

    expect(wrapper.find('.task__project-title').text()).toBe(project.title);
  });

  it('should not show a project when projectId is absent', () => {
    expect(wrapper.find('.task__project').exists()).toBe(false);
  });

  it('should not show a project when projectId is unknown', async () => {
    await wrapper.setProps({ task: { ...wrapper.props('task'), projectId: 'unknown' } });

    expect(wrapper.find('.task__project').exists()).toBe(false);
  });

  it('should update the project title when the project changes in the store', async () => {
    await wrapper.setProps({ task: { ...wrapper.props('task'), projectId: project.id } });

    useProjectsStore().projects[0].title = 'Updated title';
    await nextTick();

    expect(wrapper.find('.task__project-title').text()).toBe('Updated title');
  });

  it('should apply css classes if task is done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        description: 'Test',
        isDone: true,
        dayId: 'backlog',
        labels: [],
      },
    });

    expect(wrapper.classes()).toContain('task_done');
  });

  it('should have grab handle element', () => {
    const element = wrapper.find('.grab-handle');

    expect(element.exists()).toBe(true);
  });

  it('should have contenteditable input', async () => {
    const input = wrapper.find('.contenteditable-field');

    expect(input.exists()).toBe(true);
  });

  it('should have task actions button', () => {
    const button = wrapper.find('[title="Open task actions menu"]');

    expect(button.exists()).toBe(true);
  });

  it('should not have add labels button if task is done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        description: 'Test',
        isDone: true,
        dayId: 'backlog',
        labels: [],
      },
    });

    const button = wrapper.find('[title="Open label menu"]');

    expect(button.exists()).toBe(false);
  });

  it('should have add labels button if task is not done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        description: 'Test',
        isDone: false,
        dayId: 'backlog',
        labels: [],
      },
    });

    const button = wrapper.find('[title="Open label menu"]');

    expect(button.exists()).toBe(true);
  });

  it('should call openActionMenu when clicking on the button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openActionMenu');
    const button = wrapper.find('[title="Open task actions menu"]');

    await button.trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });

  it('should call openLabelMenu when clicking on the button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openLabelMenu');
    const button = wrapper.find('[title="Open label menu"]');

    await button.trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });
});
