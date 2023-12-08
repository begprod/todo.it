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

  it('should apply css classes when task is done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        description: 'Test',
        isDone: true,
        dayId: 'backlog',
      },
    });

    expect(wrapper.html()).toContain('line-through opacity-30');
  });

  it('should have one BaseContentEditableInput component', () => {
    expect(wrapper.findAllComponents(BaseContentEditableInput).length).toBe(1);
  });

  it('should have BaseButton component', () => {
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('should have icons component', () => {
    expect(wrapper.findComponent(EllipsisVerticalIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ChevronUpDownIcon).exists()).toBe(true);
  });

  it('should call function when click on button', async () => {
    const openActionMenu = vi.spyOn(wrapper.vm, 'openActionMenu');

    await wrapper.find('button').trigger('click');

    expect(openActionMenu).toHaveBeenCalled();
  });
});
