import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

describe('BaseTask', () => {
  let wrapper: ComponentWrapperType<typeof BaseTask>;

  const createComponent = () => {
    wrapper = mount(BaseTask, {
      props: {
        task: {
          id: '123',
          description: 'Test',
          isDone: false,
          dayId: 'backlog',
          labels: [],
        },
        backgroundColor: 'bg-neutral-50',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
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

    expect(wrapper.html()).toContain('line-through opacity-30');
  });

  it('should have background color class from props', () => {
    expect(wrapper.attributes('class')).toContain('bg-neutral-50');
  });

  it('should have grab handle element', () => {
    const element = wrapper.find('[data-test-id="task-drag-handle"]');

    expect(element.exists()).toBe(true);
  });

  it('should have contenteditable input', async () => {
    const input = wrapper.find('[data-test-id="task-description-input"]');

    expect(input.exists()).toBe(true);
  });

  it('should have task actions button', () => {
    const button = wrapper.find('[data-test-id="task-actions-menu-button"]');

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

    const button = wrapper.find('[data-test-id="task-labels-menu-button"]');

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

    const button = wrapper.find('[data-test-id="task-labels-menu-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call openActionMenu when clicking on the button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openActionMenu');
    const button = wrapper.find('[data-test-id="task-actions-menu-button"]');

    await button.trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });

  it('should call openLabelMenu when clicking on the button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openLabelMenu');
    const button = wrapper.find('[data-test-id="task-labels-menu-button"]');

    await button.trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });
});
