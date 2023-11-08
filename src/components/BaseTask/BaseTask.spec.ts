import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { EllipsisVerticalIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

describe('BaseTask', () => {
  const wrapper = mount(BaseTask, {
    props: {
      task: {
        id: '123',
        title: 'Test',
        description: 'Test',
        isDone: false,
        dayId: 'backlog',
      },
    },
    global: {
      components: {
        BaseButton,
        BaseContentEditableInput,
        EllipsisVerticalIcon,
        ChevronUpDownIcon,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  it('should apply css classes when dayId "backlog" and task is not done', () => {
    expect(wrapper.html()).toContain('!bg-zinc-100 !border-gray-300');
  });

  it('should apply css classes when task is done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        title: 'Test',
        description: 'Test',
        isDone: true,
        dayId: 'backlog',
      },
    });

    expect(wrapper.html()).toContain('!bg-teal-100 !border-teal-200 line-through');
  });

  it('should have two BaseContentEditableInput components', () => {
    expect(wrapper.findAllComponents(BaseContentEditableInput).length).toBe(2);
  });

  it('should have BaseButton component', () => {
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('should have ChevronUpDownIcon component', () => {
    expect(wrapper.findComponent(EllipsisVerticalIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ChevronUpDownIcon).exists()).toBe(true);
  });

  it('should call function when click on button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openActionMenu');

    await wrapper.find('button').trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });
});
