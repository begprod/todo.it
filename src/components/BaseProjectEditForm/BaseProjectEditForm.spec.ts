import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type { ComponentWrapperType, IProject } from '@/types';
import { useCommonStore, usePopupsStore, useProjectsStore, useTasksStore } from '@/stores';
import BaseProjectEditForm from '@/components/BaseProjectEditForm/BaseProjectEditForm.vue';

describe('BaseProjectEditForm', () => {
  let wrapper: ComponentWrapperType<typeof BaseProjectEditForm>;
  const project: IProject = {
    id: 'project-123',
    title: 'Existing project',
    color: '#123456',
    priority: 3,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
  };

  const createComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });

    setActivePinia(pinia);
    usePopupsStore().currentEditingProject = project;
    usePopupsStore().isProjectEditFormOpen = true;

    wrapper = mount(BaseProjectEditForm, {
      global: {
        plugins: [pinia],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should prefill the fields from the current project', () => {
    expect(wrapper.find<HTMLInputElement>('#edit-project-title').element.value).toBe(
      'Existing project',
    );
    expect(wrapper.findComponent({ name: 'BaseSelect' }).props('modelValue')).toBe('3');
    expect(wrapper.findComponent({ name: 'ColorPicker' }).props('pureColor')).toBe('#123456');
  });

  it('should show a toast and not update or close when title is empty', async () => {
    const projectsStore = useProjectsStore();
    const commonStore = useCommonStore();
    const popupsStore = usePopupsStore();
    const input = wrapper.findComponent({ name: 'BaseInput' });

    input.vm.$emit('update:modelValue', '');

    await nextTick();
    await wrapper.find('#edit-project-form').trigger('submit');

    expect(projectsStore.updateProject).not.toHaveBeenCalled();
    expect(popupsStore.closeProjectEditForm).not.toHaveBeenCalled();
    expect(commonStore.setStatus).toHaveBeenCalledWith('error');
    expect(commonStore.showToast).toHaveBeenCalledOnce();
  });

  it('should show a toast and not update or close when title contains only spaces', async () => {
    const projectsStore = useProjectsStore();
    const commonStore = useCommonStore();
    const popupsStore = usePopupsStore();
    const input = wrapper.findComponent({ name: 'BaseInput' });

    input.vm.$emit('update:modelValue', '   ');

    await nextTick();
    await wrapper.find('#edit-project-form').trigger('submit');

    expect(commonStore.showToast).toHaveBeenCalledOnce();
    expect(projectsStore.updateProject).not.toHaveBeenCalled();
    expect(popupsStore.closeProjectEditForm).not.toHaveBeenCalled();
  });

  it('should update the project with trimmed title and selected values', async () => {
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();
    const commonStore = useCommonStore();
    const input = wrapper.findComponent({ name: 'BaseInput' });
    const select = wrapper.findComponent({ name: 'BaseSelect' });
    const colorPicker = wrapper.findComponent({ name: 'ColorPicker' });

    input.vm.$emit('update:modelValue', '  Roadmap  ');
    select.vm.$emit('update:modelValue', '4');
    colorPicker.vm.$emit('update:pureColor', '#abcdef');

    await nextTick();
    await wrapper.find('#edit-project-form').trigger('submit');

    expect(projectsStore.updateProject).toHaveBeenCalledWith({
      id: project.id,
      title: 'Roadmap',
      color: '#abcdef',
      priority: 4,
      createdAt: project.createdAt,
      updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*Z$/),
    });
    expect(popupsStore.closeProjectEditForm).toHaveBeenCalledOnce();
    expect(commonStore.setMessage).toHaveBeenCalledWith('Project updated');
    expect(commonStore.setStatus).toHaveBeenCalledWith('success');
    expect(commonStore.showToast).toHaveBeenCalledOnce();
  });

  it('should delete the project only after confirmation', async () => {
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();
    const commonStore = useCommonStore();
    const controls = wrapper.find('.project-edit-form__controls');
    const deleteButton = controls.find('button');

    await deleteButton.trigger('click');

    expect(projectsStore.deleteProject).not.toHaveBeenCalled();
    expect(projectsStore.updateProject).not.toHaveBeenCalled();
    expect(controls.find('button').text()).toBe('Confirm deletion');

    await controls.find('button').trigger('click');

    expect(projectsStore.deleteProject).toHaveBeenCalledWith(project.id);
    expect(popupsStore.closeProjectEditForm).toHaveBeenCalledOnce();
    expect(commonStore.setMessage).toHaveBeenCalledWith('Project deleted');
    expect(commonStore.setStatus).toHaveBeenCalledWith('success');
    expect(commonStore.showToast).toHaveBeenCalledOnce();
  });

  it('should prevent deletion and show an error when the project has tasks', async () => {
    const tasksStore = useTasksStore();
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();
    const commonStore = useCommonStore();

    tasksStore.tasks = {
      backlog: {
        items: [
          {
            id: 'task-1',
            dayId: 'backlog',
            description: 'Project task',
            isDone: false,
            labels: [],
            projectId: project.id,
          },
        ],
      },
    };

    const controls = wrapper.find('.project-edit-form__controls');

    await controls.find('button').trigger('click');
    await controls.find('button').trigger('click');

    expect(projectsStore.deleteProject).not.toHaveBeenCalled();
    expect(popupsStore.closeProjectEditForm).not.toHaveBeenCalled();
    expect(controls.find('button').text()).toBe('Confirm deletion');
    expect(commonStore.setMessage).toHaveBeenCalledWith('Project has tasks and cannot be deleted');
    expect(commonStore.setStatus).toHaveBeenCalledWith('error');
    expect(commonStore.showToast).toHaveBeenCalledOnce();
  });

  it('should reset delete confirmation when the form is reopened', async () => {
    const popupsStore = usePopupsStore();
    const controls = wrapper.find('.project-edit-form__controls');

    await controls.find('button').trigger('click');

    expect(controls.find('button').text()).toBe('Confirm deletion');

    popupsStore.currentEditingProject = null;
    await nextTick();
    popupsStore.currentEditingProject = {
      ...project,
      id: 'project-456',
      title: 'Another project',
    };
    await nextTick();

    expect(wrapper.find<HTMLInputElement>('#edit-project-title').element.value).toBe(
      'Another project',
    );
    expect(controls.find('button').text()).toBe('Delete');
  });

  it('should not update when there is no current project', async () => {
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();

    popupsStore.currentEditingProject = null;

    await wrapper.find('#edit-project-form').trigger('submit');

    expect(projectsStore.updateProject).not.toHaveBeenCalled();
  });
});
