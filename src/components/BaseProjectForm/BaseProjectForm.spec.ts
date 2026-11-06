import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import type { ComponentWrapperType } from '@/types';
import { useCommonStore, usePopupsStore, useProjectsStore } from '@/stores';
import BaseProjectForm from '@/components/BaseProjectForm/BaseProjectForm.vue';

describe('BaseProjectForm', () => {
  let wrapper: ComponentWrapperType<typeof BaseProjectForm>;

  const createComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });

    setActivePinia(pinia);
    usePopupsStore().isProjectFormOpen = true;

    wrapper = mount(BaseProjectForm, {
      global: {
        plugins: [pinia],
      },
    });
  };

  beforeEach(createComponent);
  afterEach(() => wrapper.unmount());

  it('should render the project form', () => {
    expect(wrapper.find('#add-project-form').exists()).toBe(true);
  });

  it('should show a toast and not create a project when title is empty', async () => {
    const projectsStore = useProjectsStore();
    const commonStore = useCommonStore();
    const popupsStore = usePopupsStore();

    await wrapper.find('#add-project-form').trigger('submit');

    expect(projectsStore.createProject).not.toHaveBeenCalled();
    expect(popupsStore.closeProjectForm).not.toHaveBeenCalled();
    expect(commonStore.setStatus).toHaveBeenCalledWith('error');
    expect(commonStore.showToast).toHaveBeenCalledOnce();
  });

  it('should show a toast and not create a project when title contains only spaces', async () => {
    const projectsStore = useProjectsStore();
    const commonStore = useCommonStore();
    const popupsStore = usePopupsStore();
    const input = wrapper.findComponent({ name: 'BaseInput' });

    input.vm.$emit('update:modelValue', '   ');

    await wrapper.vm.$nextTick();
    await wrapper.find('#add-project-form').trigger('submit');

    expect(commonStore.showToast).toHaveBeenCalledOnce();
    expect(projectsStore.createProject).not.toHaveBeenCalled();
    expect(popupsStore.closeProjectForm).not.toHaveBeenCalled();
  });

  it('should create a valid project, reset fields, and close the form', async () => {
    const projectsStore = useProjectsStore();
    const popupsStore = usePopupsStore();
    const input = wrapper.findComponent({ name: 'BaseInput' });
    const select = wrapper.findComponent({ name: 'BaseSelect' });
    const colorPicker = wrapper.findComponent({ name: 'ColorPicker' });

    input.vm.$emit('update:modelValue', '  Roadmap  ');
    select.vm.$emit('update:modelValue', '4');
    colorPicker.vm.$emit('update:pureColor', '#abcdef');

    await wrapper.vm.$nextTick();
    await wrapper.find('#add-project-form').trigger('submit');

    expect(projectsStore.createProject).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Roadmap',
        color: '#abcdef',
        priority: 4,
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*Z$/),
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*Z$/),
      }),
    );

    const project = vi.mocked(projectsStore.createProject).mock.calls[0][0];

    expect(project.createdAt).toBe(project.updatedAt);
    expect(input.props('modelValue')).toBe('');
    expect(select.props('modelValue')).toBe('1');
    expect(colorPicker.props('pureColor')).toBe('#000000');
    expect(popupsStore.closeProjectForm).toHaveBeenCalledOnce();
  });
});
